import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import ical from "node-ical";

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

function generateSlug(title: string, uid: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  const suffix = uid
    .slice(0, 8)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return `${base}-${suffix}`;
}

async function authenticate(
  req: VercelRequest,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const authHeader = req.headers.authorization;

  if (req.method === "GET") {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return { ok: false, status: 500, error: "CRON_SECRET not configured" };
    }
    if (authHeader !== `Bearer ${cronSecret}`) {
      return { ok: false, status: 401, error: "Invalid cron secret" };
    }
    return { ok: true };
  }

  if (req.method === "POST") {
    if (!authHeader?.startsWith("Bearer ")) {
      return { ok: false, status: 401, error: "Missing authorization token" };
    }
    const token = authHeader.slice(7);
    try {
      await admin.auth().verifyIdToken(token);
      return { ok: true };
    } catch {
      return { ok: false, status: 401, error: "Invalid Firebase token" };
    }
  }

  return { ok: false, status: 405, error: "Method not allowed" };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await authenticate(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const calendarUrl = process.env.GOOGLE_CALENDAR_URL;
  if (!calendarUrl) {
    return res.status(500).json({ error: "Calendar URL not configured" });
  }

  try {
    // 1. Fetch iCal events from Google Calendar
    const data = await ical.async.fromURL(calendarUrl);
    const icalEvents = Object.values(data).filter(
      (item): item is ical.VEvent => item.type === "VEVENT",
    );

    // 2. Get existing synced events from Firestore
    const existingSnapshot = await db
      .collection("events")
      .where("googleCalendarEventId", "!=", null)
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

    // 3. Sync each iCal event
    let created = 0;
    let updated = 0;

    for (const event of icalEvents) {
      const uid = event.uid ?? String(event.start);
      const title = event.summary ?? "Sin título";
      const start =
        event.start instanceof Date
          ? event.start.toISOString()
          : String(event.start);
      const end =
        event.end instanceof Date ? event.end.toISOString() : String(event.end);
      const location = event.location ?? "";
      const description = event.description ?? "";

      const existing = existingByCalId.get(uid);

      if (existing) {
        // Update only date and endDate
        const updates: Record<string, string> = {};
        if (existing.data.date !== start) {
          updates.date = start;
        }
        if (existing.data.endDate !== end) {
          updates.endDate = end;
        }
        if (Object.keys(updates).length > 0) {
          await db.collection("events").doc(existing.docId).update(updates);
          updated++;
        }
      } else {
        // Create new event
        await db.collection("events").add({
          title,
          slug: generateSlug(title, uid),
          description,
          date: start,
          endDate: end,
          location: location || "Casa Sobre la Roca - Medellín",
          imageUrl: "",
          tags: [],
          featured: false,
          requiresRegistration: false,
          eventType: "j+",
          googleCalendarEventId: uid,
        });
        created++;
      }
    }

    return res.status(200).json({
      created,
      updated,
      total: icalEvents.length,
    });
  } catch (error) {
    console.error("Calendar sync error:", error);
    return res.status(500).json({ error: "Failed to sync calendar" });
  }
}
