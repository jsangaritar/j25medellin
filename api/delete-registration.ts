import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin auth
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await admin.auth().verifyIdToken(authHeader.slice(7));
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { id } = req.body ?? {};
  if (!id) {
    return res.status(400).json({ error: 'Registration id is required' });
  }

  try {
    const regRef = db.collection('registrations').doc(id);
    const regSnap = await regRef.get();

    if (!regSnap.exists) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const courseId = regSnap.data()?.courseId as string | null;

    if (courseId) {
      // Atomic: decrement enrolled + delete registration
      const courseRef = db.collection('courses').doc(courseId);
      await db.runTransaction(async (transaction) => {
        const courseSnap = await transaction.get(courseRef);
        if (courseSnap.exists) {
          const enrolled = (courseSnap.data()?.enrolled as number) ?? 0;
          transaction.update(courseRef, {
            enrolled: Math.max(0, enrolled - 1),
          });
        }
        transaction.delete(regRef);
      });
    } else {
      await regRef.delete();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete registration error:', error);
    return res.status(500).json({ error: 'Failed to delete registration' });
  }
}
