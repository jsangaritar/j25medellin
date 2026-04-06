import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { Resend } from 'resend';

// Initialize Firebase Admin (once per cold start)
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, whatsApp, email, eventId, courseId } = req.body ?? {};

  if (!fullName || !whatsApp || !email) {
    return res
      .status(400)
      .json({ error: 'fullName, whatsApp, and email are required' });
  }

  try {
    // Write to Firestore
    const docRef = await db.collection('registrations').add({
      fullName,
      whatsApp,
      email,
      eventId: eventId ?? null,
      courseId: courseId ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send confirmation email (best-effort)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'J+ Medellin <noreply@j25medellin.com>',
          to: email,
          subject: '¡Inscripción confirmada! — J+',
          html: `
            <h2>¡Hola ${fullName}!</h2>
            <p>Tu inscripción ha sido registrada exitosamente.</p>
            <p>Te contactaremos por WhatsApp al número ${whatsApp} con más detalles.</p>
            <p>— Equipo J+</p>
          `,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Don't fail the registration if email fails
      }
    }

    return res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create registration' });
  }
}
