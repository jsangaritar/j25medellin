import type { VercelRequest, VercelResponse } from '@vercel/node';
import ical from 'node-ical';

async function fetchFeed(url: string, source: string) {
  const data = await ical.async.fromURL(url);
  return Object.values(data)
    .filter(
      (item): item is ical.VEvent =>
        item != null && item.type === 'VEVENT',
    )
    .map((event) => ({
      id: event.uid ?? String(event.start),
      title: String(event.summary ?? 'Sin título'),
      start:
        event.start instanceof Date
          ? event.start.toISOString()
          : String(event.start),
      end:
        event.end instanceof Date
          ? event.end.toISOString()
          : String(event.end),
      description: event.description ? String(event.description) : undefined,
      location: String(event.location ?? ''),
      source,
    }));
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const jUrl = process.env.GOOGLE_CALENDAR_J_URL;
  const generalUrl = process.env.GOOGLE_CALENDAR_GENERAL_URL;

  if (!jUrl && !generalUrl) {
    return res.status(500).json({ error: 'No calendar URLs configured' });
  }

  try {
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

    res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate');
    return res.status(200).json(events);
  } catch (error) {
    console.error('Calendar fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch calendar' });
  }
}
