import { loadEnv, type Plugin } from 'vite';

/**
 * Vite dev middleware that replicates the Vercel serverless `/api/calendar`
 * endpoint locally, so the app works with `pnpm dev` without `vercel dev`.
 */
export function apiDevPlugin(): Plugin {
  let env: Record<string, string>;

  return {
    name: 'api-dev',
    apply: 'serve',
    config(_, { mode }) {
      env = loadEnv(mode, process.cwd(), '');
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/calendar') return next();

        const jUrl = env.GOOGLE_CALENDAR_J_URL;
        const generalUrl = env.GOOGLE_CALENDAR_GENERAL_URL;

        if (!jUrl && !generalUrl) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'No calendar URLs configured' }));
          return;
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

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(events));
        } catch (error) {
          console.error('Calendar fetch error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to fetch calendar' }));
        }
      });
    },
  };
}
