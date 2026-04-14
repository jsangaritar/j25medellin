import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { Resend } from 'resend';

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
    let registrationId: string;

    if (courseId) {
      // ── Course registration: atomic transaction with capacity check ──
      const courseRef = db.collection('courses').doc(courseId);
      const normalizedEmail = email.toLowerCase().trim();
      const regDocId = `${courseId}_${normalizedEmail}`;
      const regRef = db.collection('registrations').doc(regDocId);

      // Pre-transaction: check if user is already registered for another
      // course in the same topic (Firestore transactions don't support queries)
      const courseSnap = await courseRef.get();
      if (!courseSnap.exists) {
        return res.status(404).json({ error: 'COURSE_NOT_FOUND' });
      }
      const topicId = courseSnap.data()?.topicId as string | undefined;

      if (topicId) {
        const topicSnap = await db
          .collection('courseTopics')
          .doc(topicId)
          .get();
        const topicCourseIds =
          (topicSnap.data()?.courseIds as string[] | undefined) ?? [];

        if (topicCourseIds.length > 0) {
          // Firestore 'in' supports up to 30 values
          const existingRegs = await db
            .collection('registrations')
            .where('email', '==', normalizedEmail)
            .where('courseId', 'in', topicCourseIds)
            .get();

          if (!existingRegs.empty) {
            // Distinguish same-course vs different-course-same-topic
            const alreadyInSameCourse = existingRegs.docs.some(
              (d) => d.data().courseId === courseId,
            );
            return res.status(409).json({
              error: alreadyInSameCourse
                ? 'DUPLICATE_REGISTRATION'
                : 'TOPIC_DUPLICATE_REGISTRATION',
            });
          }
        }
      }

      try {
        await db.runTransaction(async (transaction) => {
          const freshCourseSnap = await transaction.get(courseRef);
          if (!freshCourseSnap.exists) {
            throw new Error('COURSE_NOT_FOUND');
          }

          const courseData = freshCourseSnap.data()!;
          const capacity = courseData.capacity as number | undefined;
          const enrolled = (courseData.enrolled as number) ?? 0;

          if (capacity != null && enrolled >= capacity) {
            throw new Error('COURSE_FULL');
          }

          // Atomic: increment counter + create registration
          transaction.update(courseRef, {
            enrolled: admin.firestore.FieldValue.increment(1),
          });
          transaction.create(regRef, {
            fullName,
            whatsApp,
            email: normalizedEmail,
            eventId: eventId ?? null,
            courseId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });
      } catch (txError: unknown) {
        const message =
          txError instanceof Error ? txError.message : String(txError);

        if (message === 'COURSE_NOT_FOUND') {
          return res.status(404).json({ error: 'COURSE_NOT_FOUND' });
        }
        if (message === 'COURSE_FULL') {
          return res.status(409).json({ error: 'COURSE_FULL' });
        }
        // Firestore throws code 6 (ALREADY_EXISTS) when transaction.create
        // targets an existing doc — this means duplicate registration
        if (
          typeof txError === 'object' &&
          txError !== null &&
          'code' in txError &&
          (txError as { code: number }).code === 6
        ) {
          return res
            .status(409)
            .json({ error: 'DUPLICATE_REGISTRATION' });
        }
        throw txError;
      }

      registrationId = regDocId;
    } else {
      // ── Event-only registration: simple write ──
      const docRef = await db.collection('registrations').add({
        fullName,
        whatsApp,
        email,
        eventId: eventId ?? null,
        courseId: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      registrationId = docRef.id;
    }

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
      }
    }

    return res.status(201).json({ id: registrationId });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create registration' });
  }
}
