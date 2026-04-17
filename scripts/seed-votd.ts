/**
 * Seed Firestore with Verse of the Day data from the YouVersion API.
 *
 * Fetches all 365/366 VOTD entries for the year, then retrieves the
 * actual verse content for NVI, NBLA, and RVES Spanish translations.
 *
 * Usage:
 *   npx tsx scripts/seed-votd.ts              # current year
 *   npx tsx scripts/seed-votd.ts --year 2027   # specific year
 *
 * Requires BIBLE_API_KEY and FIREBASE_SERVICE_ACCOUNT_KEY in .env
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import admin from 'firebase-admin';

// ── Parse CLI args ──

const yearFlagIndex = process.argv.indexOf('--year');
const targetYear =
  yearFlagIndex !== -1 && process.argv[yearFlagIndex + 1]
    ? Number.parseInt(process.argv[yearFlagIndex + 1], 10)
    : new Date().getFullYear();

// ── Load .env manually (no dotenv dependency) ──

const envPath = resolve(import.meta.dirname, '..', '.env');
const envFile = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex);
  let value = trimmed.slice(eqIndex + 1);
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  envVars[key] = value;
}

const apiKey = envVars.BIBLE_API_KEY;
const serviceAccountKey = envVars.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!apiKey) {
  console.error('Missing BIBLE_API_KEY in .env');
  process.exit(1);
}
if (!serviceAccountKey) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT_KEY in .env');
  process.exit(1);
}

// ── Firebase Admin init ──

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
});
const db = admin.firestore();

// ── YouVersion API helpers ──

const API_BASE = 'https://api.youversion.com';
const DELAY_MS = 200;

async function yvFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'X-YVP-App-Key': apiKey },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouVersion API ${res.status} for ${path}: ${text}`);
  }
  return res.json() as Promise<T>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Convert day-of-year (1-366) to YYYY-MM-DD for a given year */
function dayOfYearToDate(year: number, day: number): string {
  const date = new Date(year, 0);
  date.setDate(day);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
}

// ── Bible version config ──
// IDs verified against YouVersion API for Spanish translations

const VERSIONS = [
  { key: 'nvi', abbreviation: 'NVI', id: 128 },
  { key: 'nbla', abbreviation: 'NBLA', id: 103 },
  { key: 'rves', abbreviation: 'RVES', id: 147 },
];

// ── Main ──

/** YouVersion VOTD API response shape */
interface VotdDay {
  day: number;
  passage_id: string; // e.g. "JHN.3.16" or "ISA.43.18-19"
}

/** YouVersion passages API response shape */
interface PassageResponse {
  id: string;
  content: string;
  reference: string; // human-readable, e.g. "Juan 3:16"
}

async function main() {
  console.log(`\n📖 Seeding VOTD for year ${targetYear}\n`);

  // 1. Fetch VOTD list for the year
  console.log('📅 Fetching Verse of the Day list...');
  let votdList: VotdDay[];
  try {
    const response = await yvFetch<{ data: VotdDay[] }>(
      '/v1/verse_of_the_days',
    );
    votdList = response.data ?? [];
    console.log(`  Found ${votdList.length} days`);
  } catch (err) {
    console.error(`  ✗ Failed to fetch VOTD list: ${err}`);
    process.exit(1);
  }

  if (votdList.length === 0) {
    console.error('  ✗ No VOTD entries returned from API');
    process.exit(1);
  }

  // 2. Check which days already exist in Firestore
  console.log('\n🔎 Checking existing entries in Firestore...');
  const allDates = votdList.map((v) => dayOfYearToDate(targetYear, v.day));
  const existingDocs = new Set<string>();

  for (let i = 0; i < allDates.length; i += 100) {
    const batch = allDates.slice(i, i + 100);
    const refs = batch.map((date) => db.collection('votd').doc(date));
    const snapshots = await db.getAll(...refs);
    for (const snap of snapshots) {
      if (snap.exists) existingDocs.add(snap.id);
    }
  }

  const toSeed = votdList.filter(
    (v) => !existingDocs.has(dayOfYearToDate(targetYear, v.day)),
  );
  console.log(
    `  ${existingDocs.size} already seeded, ${toSeed.length} remaining`,
  );

  if (toSeed.length === 0) {
    console.log('\n✅ All days already seeded!');
    process.exit(0);
  }

  // 3. Fetch verse content and write to Firestore
  console.log(`\n📥 Fetching verse content for ${toSeed.length} days...\n`);
  const failures: { day: number; date: string; error: string }[] = [];
  let writeBatch = db.batch();
  let batchCount = 0;
  let seededCount = 0;

  for (const votdDay of toSeed) {
    const date = dayOfYearToDate(targetYear, votdDay.day);
    const translations: Record<
      string,
      {
        bibleId: number;
        abbreviation: string;
        citation: string;
        passage: string;
      }
    > = {};
    let hasError = false;

    for (const version of VERSIONS) {
      try {
        const response = await yvFetch<PassageResponse>(
          `/v1/bibles/${version.id}/passages/${votdDay.passage_id}`,
        );
        translations[version.key] = {
          bibleId: version.id,
          abbreviation: version.abbreviation,
          citation: response.reference,
          passage: stripHtml(response.content),
        };
        await sleep(DELAY_MS);
      } catch (err) {
        console.error(
          `  ✗ Day ${votdDay.day} (${date}) ${version.abbreviation}: ${err}`,
        );
        hasError = true;
        break;
      }
    }

    if (hasError || Object.keys(translations).length !== VERSIONS.length) {
      failures.push({
        day: votdDay.day,
        date,
        error: 'Failed to fetch all translations',
      });
      continue;
    }

    const docRef = db.collection('votd').doc(date);
    writeBatch.set(docRef, {
      date,
      year: targetYear,
      reference: votdDay.passage_id,
      translations,
      seededAt: new Date().toISOString(),
    });
    batchCount++;
    seededCount++;

    const citation = translations.nvi?.citation ?? votdDay.passage_id;
    console.log(
      `  ✓ ${date} — ${citation} (${seededCount}/${toSeed.length})`,
    );

    // Flush batch every 500 writes (Firestore limit)
    if (batchCount >= 500) {
      await writeBatch.commit();
      writeBatch = db.batch();
      batchCount = 0;
    }
  }

  // Flush remaining writes
  if (batchCount > 0) {
    await writeBatch.commit();
  }

  // 4. Summary
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Seeded ${seededCount} VOTD entries for ${targetYear}`);
  if (failures.length > 0) {
    console.log(`⚠  ${failures.length} days failed:`);
    for (const f of failures) {
      console.log(`   Day ${f.day} (${f.date}): ${f.error}`);
    }
    console.log('\nRe-run the script to retry failed days.');
  }
  console.log();

  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
