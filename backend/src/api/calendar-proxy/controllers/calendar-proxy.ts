import type { Context } from 'koa';

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

let cachedEvents: CalendarEvent[] | null = null;
let cacheTimestamp = 0;

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

interface GoogleCalendarItem {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  description?: string;
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarItem[];
}

export default {
  async find(ctx: Context) {
    const now = Date.now();

    if (cachedEvents && now - cacheTimestamp < CACHE_TTL_MS) {
      ctx.body = { events: cachedEvents };
      return;
    }

    const siteConfig = await strapi
      .service('api::site-config.site-config')
      .find();

    const calendarUrl = siteConfig?.googleCalendarUrl;
    if (!calendarUrl) {
      ctx.status = 400;
      ctx.body = { error: 'Google Calendar URL not configured' };
      return;
    }

    try {
      const response = await fetch(calendarUrl);
      if (!response.ok) {
        throw new Error(`Calendar fetch failed: ${response.status}`);
      }

      const data: GoogleCalendarResponse = await response.json();
      const events: CalendarEvent[] = (data.items ?? []).map((item) => ({
        id: item.id,
        title: item.summary ?? '',
        start: item.start?.dateTime ?? item.start?.date ?? '',
        end: item.end?.dateTime ?? item.end?.date ?? '',
        description: item.description ?? '',
      }));

      cachedEvents = events;
      cacheTimestamp = now;

      ctx.body = { events };
    } catch (error) {
      strapi.log.error('Calendar proxy error:', error);
      ctx.status = 502;
      ctx.body = { error: 'Failed to fetch calendar data' };
    }
  },
};
