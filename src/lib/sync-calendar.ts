import { serverTimestamp } from 'firebase/firestore';
import { createDocument, getEvents, updateDocument } from './firestore';

interface CalendarEventRaw {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  source?: string;
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

function getImageForTitle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('la mesa')) return '/images/la-mesa.png';
  if (lower.includes('la sala')) return '/images/la-sala.png';
  return '';
}

export async function syncCalendarEvents(): Promise<{
  created: number;
  updated: number;
  total: number;
}> {
  const res = await fetch('/api/calendar');
  if (!res.ok) {
    throw new Error('No se pudo obtener el calendario de Google');
  }
  const calendarEvents: CalendarEventRaw[] = await res.json();

  const existingEvents = await getEvents();
  const existingByCalId = new Map(
    existingEvents
      .filter((e) => e.googleCalendarEventId)
      .map((e) => [e.googleCalendarEventId, e]),
  );

  let created = 0;
  let updated = 0;

  for (const calEvent of calendarEvents) {
    const existing = existingByCalId.get(calEvent.id);

    if (existing) {
      const updates: Record<string, string | boolean> = {};
      if (existing.date !== calEvent.start) {
        updates.date = calEvent.start;
      }
      if (existing.endDate !== calEvent.end) {
        updates.endDate = calEvent.end;
      }
      const hasCustomContent =
        existing.title !== calEvent.title ||
        existing.description !== (calEvent.description || '');
      if (existing.hasCustomContent !== hasCustomContent) {
        updates.hasCustomContent = hasCustomContent;
      }
      if (Object.keys(updates).length > 0) {
        await updateDocument('events', existing.id, updates);
        updated++;
      }
    } else {
      await createDocument('events', {
        title: calEvent.title,
        slug: generateSlug(calEvent.title, calEvent.id),
        description: calEvent.description || '',
        date: calEvent.start,
        endDate: calEvent.end,
        location: calEvent.location || 'Casa Sobre la Roca - Medellín',
        imageUrl: getImageForTitle(calEvent.title),
        tags: [],
        featured: false,
        requiresRegistration: false,
        eventType: calEvent.source === 'church' ? 'church' : 'j+',
        googleCalendarEventId: calEvent.id,
        createdAt: serverTimestamp(),
      });
      created++;
    }
  }

  return { created, updated, total: calendarEvents.length };
}
