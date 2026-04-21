import type { IncomingMessage, ServerResponse } from 'node:http';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { loadEnv, type Plugin } from 'vite';
import {
  contactNotificationHtml,
  registrationConfirmationHtml,
} from '../api/email-templates';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = capitalize(
    format(start, sameYear ? "d 'de' MMM" : "d 'de' MMM, yyyy", {
      locale: es,
    }),
  );
  const endStr = capitalize(format(end, "d 'de' MMM, yyyy", { locale: es }));
  return `${startStr} \u2014 ${endStr}`;
}

/**
 * Vite dev middleware that replicates Vercel serverless endpoints locally,
 * so the app works with `pnpm dev` without `vercel dev`.
 * Only active during development (apply: 'serve').
 */
export function apiDevPlugin(): Plugin {
  let env: Record<string, string>;
  let adminDb: FirebaseFirestore.Firestore | null = null;

  async function getDb() {
    if (adminDb) return adminDb;
    const admin = (await import('firebase-admin')).default;
    if (!admin.apps.length) {
      // Vite's loadEnv may mangle the JSON service account key,
      // so read it directly from .env file
      const fs = await import('node:fs');
      const path = await import('node:path');
      const envPath = path.resolve(process.cwd(), '.env');
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const line = envContent
        .split('\n')
        .find((l) => l.startsWith('FIREBASE_SERVICE_ACCOUNT_KEY='));
      const key = line?.slice('FIREBASE_SERVICE_ACCOUNT_KEY='.length).trim();

      if (key) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(key)),
        });
      } else {
        admin.initializeApp();
      }
    }
    adminDb = admin.firestore();
    return adminDb;
  }

  function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk: Buffer) => {
        data += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch {
          reject(new Error('Invalid JSON'));
        }
      });
      req.on('error', reject);
    });
  }

  function json(
    res: ServerResponse,
    status: number,
    body: Record<string, unknown>,
  ) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  }

  return {
    name: 'api-dev',
    apply: 'serve',
    config(_, { mode }) {
      env = loadEnv(mode, process.cwd(), '');
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // ── /api/calendar ──
        if (req.url === '/api/calendar') {
          const jUrl = env.GOOGLE_CALENDAR_J_URL;
          const generalUrl = env.GOOGLE_CALENDAR_GENERAL_URL;

          if (!jUrl && !generalUrl) {
            return json(res, 500, {
              error: 'No calendar URLs configured',
            });
          }

          try {
            const ical = await import('node-ical');

            async function fetchFeed(url: string, source: string) {
              const data = await ical.default.async.fromURL(url);
              return Object.values(data)
                .filter(
                  (item): item is import('node-ical').VEvent =>
                    item != null && item.type === 'VEVENT',
                )
                .map((event) => ({
                  id: event.uid ?? String(event.start),
                  title: event.summary ?? 'Sin título',
                  start:
                    event.start instanceof Date
                      ? event.start.toISOString()
                      : String(event.start),
                  end:
                    event.end instanceof Date
                      ? event.end.toISOString()
                      : String(event.end),
                  description: event.description ?? undefined,
                  location: event.location ?? 'Casa Sobre la Roca - Medellín',
                  source,
                }));
            }

            async function safeFetch(url: string, source: string) {
              try {
                return await fetchFeed(url, source);
              } catch (err) {
                console.warn(`Failed to fetch ${source} calendar:`, err);
                return [];
              }
            }

            const feeds = await Promise.all([
              jUrl ? safeFetch(jUrl, 'j+') : [],
              generalUrl ? safeFetch(generalUrl, 'church') : [],
            ]);

            const events = feeds
              .flat()
              .sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime(),
              );

            return json(res, 200, events as unknown as Record<string, unknown>);
          } catch (error) {
            console.error('Calendar fetch error:', error);
            return json(res, 500, { error: 'Failed to fetch calendar' });
          }
        }

        // ── /api/register ──
        if (req.url === '/api/register' && req.method === 'POST') {
          try {
            const admin = (await import('firebase-admin')).default;
            const db = await getDb();
            const body = await parseBody(req);
            const { fullName, whatsApp, email, eventId, courseId } =
              body as Record<string, string>;

            if (!fullName || !whatsApp || !email) {
              return json(res, 400, {
                error: 'fullName, whatsApp, and email are required',
              });
            }

            let registrationId: string;
            let courseName: string | undefined;
            let topicName: string | undefined;
            let topicDateRange: string | undefined;
            let topicModality: string | undefined;
            let topicLocation: string | undefined;
            let eventName: string | undefined;

            if (courseId) {
              const courseRef = db.collection('courses').doc(courseId);
              const normalizedEmail = (email as string).toLowerCase().trim();
              const regDocId = `${courseId}_${normalizedEmail}`;
              const regRef = db.collection('registrations').doc(regDocId);

              // Topic duplicate check
              const courseSnap = await courseRef.get();
              if (!courseSnap.exists) {
                return json(res, 404, { error: 'COURSE_NOT_FOUND' });
              }
              courseName = courseSnap.data()?.title as string | undefined;
              const topicId = courseSnap.data()?.topicId as string | undefined;

              if (topicId) {
                const topicSnap = await db
                  .collection('courseTopics')
                  .doc(topicId)
                  .get();
                const topicData = topicSnap.data();
                topicName = topicData?.title as string | undefined;
                topicModality = topicData?.modality as string | undefined;
                topicLocation = topicData?.location as string | undefined;
                const tStart = topicData?.startDate as string | undefined;
                const tEnd = topicData?.endDate as string | undefined;
                if (tStart && tEnd) {
                  topicDateRange = formatDateRange(tStart, tEnd);
                }
                const topicCourseIds =
                  (topicData?.courseIds as string[] | undefined) ?? [];

                if (topicCourseIds.length > 0) {
                  const existingRegs = await db
                    .collection('registrations')
                    .where('email', '==', normalizedEmail)
                    .where('courseId', 'in', topicCourseIds)
                    .get();

                  if (!existingRegs.empty) {
                    const alreadyInSameCourse = existingRegs.docs.some(
                      (d) => d.data().courseId === courseId,
                    );
                    return json(res, 409, {
                      error: alreadyInSameCourse
                        ? 'DUPLICATE_REGISTRATION'
                        : 'TOPIC_DUPLICATE_REGISTRATION',
                    });
                  }
                }
              }

              try {
                await db.runTransaction(async (transaction) => {
                  const freshSnap = await transaction.get(courseRef);
                  if (!freshSnap.exists) throw new Error('COURSE_NOT_FOUND');

                  const courseData = freshSnap.data() as Record<
                    string,
                    unknown
                  >;
                  const capacity = courseData.capacity as number | undefined;
                  const enrolled = (courseData.enrolled as number) ?? 0;

                  if (capacity != null && enrolled >= capacity) {
                    throw new Error('COURSE_FULL');
                  }

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
                const msg =
                  txError instanceof Error ? txError.message : String(txError);
                if (msg === 'COURSE_NOT_FOUND')
                  return json(res, 404, { error: 'COURSE_NOT_FOUND' });
                if (msg === 'COURSE_FULL')
                  return json(res, 409, { error: 'COURSE_FULL' });
                if (
                  typeof txError === 'object' &&
                  txError !== null &&
                  'code' in txError &&
                  (txError as { code: number }).code === 6
                ) {
                  return json(res, 409, { error: 'DUPLICATE_REGISTRATION' });
                }
                throw txError;
              }

              registrationId = regDocId;
            } else {
              if (eventId) {
                const eventSnap = await db
                  .collection('events')
                  .doc(eventId as string)
                  .get();
                eventName = eventSnap.data()?.title as string | undefined;
              }

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

            // Best-effort email
            const resendKey = env.RESEND_API_KEY;
            if (resendKey) {
              try {
                const { Resend } = await import('resend');
                const resend = new Resend(resendKey);
                const isCourse = Boolean(courseId);
                const itemName = isCourse ? courseName : eventName;
                const configSnap = await db.doc('settings/config').get();
                const configData = configSnap.data();
                await resend.emails.send({
                  from: 'J+ Medellín <noreply@j25medellin.com>',
                  to: email as string,
                  subject: itemName
                    ? `¡Inscripción confirmada — ${itemName}! — J+`
                    : '¡Inscripción confirmada! — J+',
                  html: registrationConfirmationHtml({
                    fullName: fullName as string,
                    type: isCourse ? 'course' : 'event',
                    courseName,
                    topicName,
                    topicDateRange,
                    topicModality,
                    topicLocation,
                    eventName,
                    siteConfig: {
                      instagramUrl: configData?.instagramUrl as
                        | string
                        | undefined,
                      youtubeUrl: configData?.youtubeUrl as string | undefined,
                      calendarUrl: env.GOOGLE_CALENDAR_J_URL,
                    },
                  }),
                });
              } catch (emailError) {
                console.error('Email send error:', emailError);
              }
            }

            return json(res, 201, { id: registrationId });
          } catch (error) {
            console.error('Registration error:', error);
            return json(res, 500, { error: 'Failed to create registration' });
          }
        }

        // ── /api/delete-registration ──
        if (req.url === '/api/delete-registration' && req.method === 'DELETE') {
          try {
            const db = await getDb();
            const body = await parseBody(req);
            const { id } = body as Record<string, string>;

            if (!id) {
              return json(res, 400, { error: 'Registration id is required' });
            }

            const regRef = db.collection('registrations').doc(id);
            const regSnap = await regRef.get();

            if (!regSnap.exists) {
              return json(res, 404, { error: 'Registration not found' });
            }

            const courseId = regSnap.data()?.courseId as string | null;

            if (courseId) {
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

            return json(res, 200, { success: true });
          } catch (error) {
            console.error('Delete registration error:', error);
            return json(res, 500, {
              error: 'Failed to delete registration',
            });
          }
        }

        // ── /api/contact ──
        if (req.url === '/api/contact' && req.method === 'POST') {
          try {
            const admin = (await import('firebase-admin')).default;
            const db = await getDb();
            const body = await parseBody(req);
            const { fullName, whatsApp, email, message } = body as Record<
              string,
              string
            >;

            if (!fullName || !whatsApp || !email || !message) {
              return json(res, 400, {
                error: 'fullName, whatsApp, email, and message are required',
              });
            }

            await db.collection('contactMessages').add({
              fullName,
              whatsApp,
              email,
              message,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Forward email
            const resendKey = env.RESEND_API_KEY;
            const configSnap = await db.doc('settings/config').get();
            const configData = configSnap.data();
            const contactEmail = configData?.contactEmail;

            if (resendKey && contactEmail) {
              try {
                const { Resend } = await import('resend');
                const resend = new Resend(resendKey);
                await resend.emails.send({
                  from: 'J+ Medellín <noreply@j25medellin.com>',
                  to: contactEmail,
                  replyTo: email as string,
                  subject: `Nuevo mensaje de contacto — ${fullName}`,
                  html: contactNotificationHtml({
                    fullName: fullName as string,
                    whatsApp: whatsApp as string,
                    email: email as string,
                    message: message as string,
                    siteConfig: {
                      instagramUrl: configData?.instagramUrl as
                        | string
                        | undefined,
                      youtubeUrl: configData?.youtubeUrl as string | undefined,
                    },
                  }),
                });
              } catch (emailError) {
                console.error('Email send error:', emailError);
              }
            }

            return json(res, 201, { ok: true });
          } catch (error) {
            console.error('Contact error:', error);
            return json(res, 500, { error: 'Failed to send message' });
          }
        }

        next();
      });
    },
  };
}
