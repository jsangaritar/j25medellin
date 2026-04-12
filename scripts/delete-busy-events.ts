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
  const snapshot = await db
    .collection('events')
    .where('title', '==', 'Busy')
    .get();

  console.log(`Found ${snapshot.size} "Busy" events.`);

  for (const doc of snapshot.docs) {
    await db.collection('events').doc(doc.id).delete();
    console.log(`Deleted: ${doc.id}`);
  }

  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
