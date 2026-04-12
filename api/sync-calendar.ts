import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import ical from 'node-ical';

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

function generateSlug(title: string, uid: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
  const suffix = uid
    .slice(0, 8)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return `${base}-${suffix}`;
}

function getImageForTitle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('la mesa')) return '/images/la-mesa.png';
  if (lower.includes('la sala')) return '/images/la-sala.png';
  return '';
}

async function fetchCalendarEvents(
  url: string,
  eventType: 'j+' | 'church',
): Promise<
  {
    uid: string;
    title: string;
    start: string;
    end: string;
    location: string;
    description: string;
    eventType: 'j+' | 'church';
  }[]
> {
  const data = await ical.async.fromURL(url);
  return Object.values(data)
    .filter(
      (item): item is ical.VEvent =>
        item != null && item.type === 'VEVENT',
    )
    .map((event) => ({
      uid: event.uid ?? String(event.start),
      title: String(event.summary ?? 'Sin título'),
      start:
        event.start instanceof Date
          ? event.start.toISOString()
          : String(event.start),
      end:
        event.end instanceof Date
          ? event.end.toISOString()
          : String(event.end),
      location: String(event.location ?? ''),
      description: String(event.description ?? ''),
      eventType,
    }));
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate via Firebase ID token
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }
  try {
    await admin.auth().verifyIdToken(authHeader.slice(7));
  } catch {
    return res.status(401).json({ error: 'Invalid Firebase token' });
  }

  const jUrl = process.env.GOOGLE_CALENDAR_J_URL;
  const generalUrl = process.env.GOOGLE_CALENDAR_GENERAL_URL;

  if (!jUrl && !generalUrl) {
    return res
      .status(500)
      .json({ error: 'No calendar URLs configured' });
  }

  try {
    // Fetch both calendars in parallel (graceful per-feed failure)
    async function safeFetch(
      url: string,
      eventType: 'j+' | 'church',
    ) {
      try {
        return await fetchCalendarEvents(url, eventType);
      } catch (err) {
        console.warn(`Failed to fetch ${eventType} calendar:`, err);
        return [];
      }
    }

    const feeds = await Promise.all([
      jUrl ? safeFetch(jUrl, 'j+') : [],
      generalUrl ? safeFetch(generalUrl, 'church') : [],
    ]);
    const allEvents = feeds.flat();

    // Get existing synced events from Firestore
    const existingSnapshot = await db
      .collection('events')
      .where('googleCalendarEventId', '!=', null)
      .get();

    const existingByCalId = new Map<
      string,
      { docId: string; data: admin.firestore.DocumentData }
    >();
    for (const doc of existingSnapshot.docs) {
      const docData = doc.data();
      if (docData.googleCalendarEventId) {
        existingByCalId.set(docData.googleCalendarEventId, {
          docId: doc.id,
          data: docData,
        });
      }
    }

    let created = 0;
    let updated = 0;

    for (const event of allEvents) {
      const existing = existingByCalId.get(event.uid);

      if (existing) {
        const updates: Record<string, string> = {};
        if (existing.data.date !== event.start) updates.date = event.start;
        if (existing.data.endDate !== event.end) updates.endDate = event.end;
        if (Object.keys(updates).length > 0) {
          await db
            .collection('events')
            .doc(existing.docId)
            .update(updates);
          updated++;
        }
      } else {
        await db.collection('events').add({
          title: event.title,
          slug: generateSlug(event.title, event.uid),
          description: event.description,
          date: event.start,
          endDate: event.end,
          location: event.location || 'Casa Sobre la Roca - Medellín',
          imageUrl: getImageForTitle(event.title),
          tags: [],
          featured: false,
          requiresRegistration: false,
          eventType: event.eventType,
          googleCalendarEventId: event.uid,
        });
        created++;
      }
    }

    return res.status(200).json({
      created,
      updated,
      total: allEvents.length,
    });
  } catch (error) {
    console.error('Calendar sync error:', error);
    return res.status(500).json({ error: 'Failed to sync calendar' });
  }
}
