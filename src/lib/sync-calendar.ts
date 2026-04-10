import { createDocument, getEvents, updateDocument } from './firestore';

interface CalendarEventRaw {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}

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

export async function syncCalendarEvents(): Promise<{
  created: number;
  updated: number;
  total: number;
}> {
  // 1. Fetch parsed calendar events from the API proxy
  const res = await fetch('/api/calendar');
  if (!res.ok) {
    throw new Error('No se pudo obtener el calendario de Google');
  }
  const calendarEvents: CalendarEventRaw[] = await res.json();

  // 2. Get existing events with googleCalendarEventId from Firestore
  const existingEvents = await getEvents();
  const existingByCalId = new Map(
    existingEvents
      .filter((e) => e.googleCalendarEventId)
      .map((e) => [e.googleCalendarEventId, e]),
  );

  // 3. Sync each calendar event
  let created = 0;
  let updated = 0;

  for (const calEvent of calendarEvents) {
    const existing = existingByCalId.get(calEvent.id);

    if (existing) {
      // Update only date and endDate — nothing else
      const updates: Record<string, string> = {};
      if (existing.date !== calEvent.start) {
        updates.date = calEvent.start;
      }
      if (existing.endDate !== calEvent.end) {
        updates.endDate = calEvent.end;
      }
      if (Object.keys(updates).length > 0) {
        await updateDocument('events', existing.id, updates);
        updated++;
      }
    } else {
      // Create new event
      await createDocument('events', {
        title: calEvent.title,
        slug: generateSlug(calEvent.title, calEvent.id),
        description: calEvent.description || '',
        date: calEvent.start,
        endDate: calEvent.end,
        location: calEvent.location || 'Casa Sobre la Roca - Medellín',
        imageUrl: '',
        tags: [],
        featured: false,
        requiresRegistration: false,
        eventType: 'j+',
        googleCalendarEventId: calEvent.id,
      });
      created++;
    }
  }

  return { created, updated, total: calendarEvents.length };
}
