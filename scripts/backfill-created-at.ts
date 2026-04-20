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

const COLLECTIONS = ['events', 'courses', 'courseTopics', 'mediaContents'];

async function main() {
  for (const collectionName of COLLECTIONS) {
    const snapshot = await db.collection(collectionName).get();
    let backfilled = 0;

    for (const doc of snapshot.docs) {
      if (!doc.data().createdAt) {
        await doc.ref.update({
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        backfilled++;
      }
    }

    console.log(
      `${collectionName}: ${backfilled} of ${snapshot.size} documents backfilled.`,
    );
  }

  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
