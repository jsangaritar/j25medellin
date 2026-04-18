import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { Resend } from 'resend';
import { contactNotificationHtml } from './email-templates.js';

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

  const { fullName, whatsApp, email, message } = req.body ?? {};

  if (!fullName || !whatsApp || !email || !message) {
    return res
      .status(400)
      .json({ error: 'fullName, whatsApp, email, and message are required' });
  }

  try {
    // Save to Firestore
    await db.collection('contactMessages').add({
      fullName,
      whatsApp,
      email,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Forward email to contact address
    const resendKey = process.env.RESEND_API_KEY;
    const configSnap = await db.doc('settings/config').get();
    const configData = configSnap.data();
    const contactEmail = configData?.contactEmail;

    if (resendKey && contactEmail) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'J+ Medellin <noreply@j25medellin.com>',
        to: contactEmail,
        replyTo: email,
        subject: `Nuevo mensaje de contacto — ${fullName}`,
        html: contactNotificationHtml({
          fullName,
          whatsApp,
          email,
          message,
          siteConfig: {
            instagramUrl: configData?.instagramUrl as string | undefined,
            youtubeUrl: configData?.youtubeUrl as string | undefined,
          },
        }),
      });
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
