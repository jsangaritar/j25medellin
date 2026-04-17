/**
 * Update event descriptions and titles in Firestore.
 *
 * - "La Sala" events get their standard description
 * - "La Mesa" events get their standard description
 * - Monthly "Oracion" events starting at 7pm get renamed to "Viernes de gratitud"
 *
 * Usage:
 *   npx tsx scripts/update-event-descriptions.ts            # dry-run
 *   npx tsx scripts/update-event-descriptions.ts --apply     # apply changes
 */

import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ── Firebase init ──

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

// ── Descriptions ──

const LA_SALA_DESCRIPTION = `Un espacio para salir del ritmo de siempre y abrirte a algo más. Un tiempo de alabanza y enseñanzas basadas en la Palabra de Dios que conectan con lo que estamos viviendo, ya sea desde una sola voz o a través de diferentes perspectivas.

No es solo escuchar, es venir con la expectativa de que Dios puede hablarte de forma práctica y directa, en medio de un ambiente auténtico y sin pretensiones.`;

const LA_MESA_DESCRIPTION = `Si La Sala abre la conversación, La Mesa la lleva más profundo. Es el espacio donde la profundización toma forma a través del discipulado en comunidad, combinando contenido sólido con la intención de llevarlo a la vida diaria.

Aquí crecemos juntos: escuchamos, preguntamos y aprendemos en un ambiente cercano, donde el proceso es tan importante como las respuestas.`;

// ── Main ──

const dryRun = !process.argv.includes('--apply');

async function main() {
  if (dryRun) {
    console.log('🔍 DRY RUN — pass --apply to write changes\n');
  }

  const snapshot = await db.collection('events').get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const title: string = data.title ?? '';
    const lower = title.toLowerCase();
    const updates: Record<string, string> = {};

    // La Sala description
    if (lower.includes('la sala') && data.description !== LA_SALA_DESCRIPTION) {
      updates.description = LA_SALA_DESCRIPTION;
    }

    // La Mesa description
    if (lower.includes('la mesa') && data.description !== LA_MESA_DESCRIPTION) {
      updates.description = LA_MESA_DESCRIPTION;
    }

    // Monthly Oracion at 7pm COT → "Viernes de gratitud"
    if (lower.includes('oracion') || lower.includes('oración')) {
      const eventDate = data.date ? new Date(data.date) : null;
      if (eventDate) {
        // COT = UTC-5 → 7pm COT = 00:00 UTC next day
        const cotHour = (eventDate.getUTCHours() - 5 + 24) % 24;
        if (cotHour === 19 && data.title !== 'Viernes de gratitud') {
          updates.title = 'Viernes de gratitud';
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      const label = Object.entries(updates)
        .map(([k, v]) => `${k}: ${v.length > 60 ? `${v.slice(0, 60)}...` : v}`)
        .join(', ');

      if (dryRun) {
        console.log(`[DRY] "${data.title}" (${data.date}) → ${label}`);
      } else {
        await db.collection('events').doc(doc.id).update(updates);
        console.log(`Updated "${data.title}" → ${label}`);
      }
      updated++;
    }
  }

  console.log(
    `\nDone. ${dryRun ? 'Would update' : 'Updated'} ${updated} of ${snapshot.size} events.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
