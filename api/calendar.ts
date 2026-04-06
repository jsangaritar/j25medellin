import type { VercelRequest, VercelResponse } from '@vercel/node';
import ical from 'node-ical';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const calendarUrl = process.env.GOOGLE_CALENDAR_URL;
  if (!calendarUrl) {
    return res.status(500).json({ error: 'Calendar URL not configured' });
  }

  try {
    const data = await ical.async.fromURL(calendarUrl);
    const events = Object.values(data)
      .filter((item): item is ical.VEvent => item.type === 'VEVENT')
      .map((event) => ({
        id: event.uid ?? String(event.start),
        title: event.summary ?? 'Sin título',
        start: event.start instanceof Date
          ? event.start.toISOString()
          : String(event.start),
        end: event.end instanceof Date
          ? event.end.toISOString()
          : String(event.end),
        description: event.description ?? undefined,
      }))
      .sort(
        (a, b) =>
          new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    // Cache for 30 minutes on Vercel's edge
        // Cache for 12 hours on Vercel's edge
    res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate');
    return res.status(200).json(events);
  } catch (error) {
    console.error('Calendar fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch calendar' });
  }
}
