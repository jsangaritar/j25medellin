import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(import.meta.dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const serviceAccountRaw = envContent
  .split('\n')
  .find((l) => l.startsWith('FIREBASE_SERVICE_ACCOUNT_KEY='));
if (!serviceAccountRaw) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY not found in .env');
  process.exit(1);
}
const serviceAccountJson = serviceAccountRaw
  .replace('FIREBASE_SERVICE_ACCOUNT_KEY=', '')
  .trim();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
});

const db = admin.firestore();

async function main() {
  // Count registrations per courseId
  const regsSnapshot = await db.collection('registrations').get();
  const counts = new Map<string, number>();

  for (const doc of regsSnapshot.docs) {
    const courseId = doc.data().courseId as string | null;
    if (courseId) {
      counts.set(courseId, (counts.get(courseId) ?? 0) + 1);
    }
  }

  console.log(
    `Found ${regsSnapshot.size} registrations across ${counts.size} courses.`,
  );

  // Update each course with enrolled count
  const coursesSnapshot = await db.collection('courses').get();
  let updated = 0;

  for (const doc of coursesSnapshot.docs) {
    const enrolled = counts.get(doc.id) ?? 0;
    const current = (doc.data().enrolled as number) ?? 0;

    if (current !== enrolled) {
      await db.collection('courses').doc(doc.id).update({ enrolled });
      console.log(
        `Updated "${doc.data().title}": ${current} → ${enrolled}`,
      );
      updated++;
    }
  }

  console.log(`\nDone. Updated ${updated} of ${coursesSnapshot.size} courses.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
