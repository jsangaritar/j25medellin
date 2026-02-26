# CLAUDE.md — J+ Medellin Project

## Project Overview

Web app for "J+" (J+25 Medellin), a faith-based young adult community in Medellin, Colombia. Central hub for events, discipleship courses, and media content.

## Tech Stack

- **Frontend**: React 19 + Vite 7 + TypeScript 5.9
- **Backend/CMS**: Strapi 5 (SQLite local, PostgreSQL production)
- **Styling**: Tailwind CSS v4 (design tokens in `frontend/src/index.css`)
- **State**: TanStack Query (server state), React useState (UI state)
- **Routing**: React Router v7 (library mode, not framework)
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting/Formatting**: Biome 2.4 (replaces ESLint + Prettier)
- **Package Manager**: pnpm (workspace monorepo)
- **Email**: Resend (transactional emails)

## Monorepo Structure

```
j25medellin/
├── frontend/    # React + Vite app
├── backend/     # Strapi 5 CMS
├── biome.json   # Shared linter/formatter config
├── PLAN.md      # Full implementation plan
└── CLAUDE.md    # This file
```

## Branding

- The group is called **J+25** but all user-facing copy must say **"J+"**
- Exception: site meta description can reference "J+25"
- Logo: `j25-logo.svg` (white SVG) — used in Header, Footer, favicon
- Language: **Spanish only** (no i18n)
- Theme: **Dark mode only**

## Commands

```bash
pnpm dev              # Start frontend dev server
pnpm dev:backend      # Start Strapi dev server
pnpm dev:all          # Start both in parallel
pnpm build            # Build frontend for production
pnpm build:backend    # Build Strapi for production
pnpm test             # Run frontend tests (Vitest)
pnpm check            # Run Biome lint + format check
pnpm check:fix        # Auto-fix Biome issues
```

## Before Committing

Always run `pnpm check` before committing. If there are fixable issues, run `pnpm check:fix` first. Only the non-null assertion warning in `main.tsx` is expected.

## Design Tokens (from j25medellin.pen)

### Colors
- Accent: `#4ADE80` (bright green), `#22C55E` (muted), `#16A34A1A` (dim/transparent)
- Backgrounds: `#0A0A0A` (primary), `#141414` (surface), `#1A1A1A` (card), `#222222` (elevated)
- Text: `#FAFAFA` (primary), `#A1A1AA` (secondary), `#71717A` (muted), `#3F3F46` (dim)
- Borders: `#27272A` (primary), `#1E1E1E` (light)

### Fonts
- Display/headings: **Montserrat** (700, 800)
- Body: **Inter** (400, 500, 600, 700)

### Breakpoints
- Mobile: 390px (`sm:`)
- Tablet: 768px (`md:`)
- Desktop: 1440px (`lg:`)

## Content Types (Strapi)

- **Event**: title, slug, description, date, location, image, tags, featured, requiresRegistration
- **Course**: title, slug, description, image, tags, status (DRAFT/COMING_SOON/ACTIVE/COMPLETED/ARCHIVED)
- **MediaContent**: title, slug, description, type (VIDEO/AUDIO/DOCUMENT), externalUrl, file, featured
- **Registration**: fullName, whatsApp, email, event (relation), course (relation)
- **SiteConfig** (single type): heroTitle, heroSubtitle, whatsappNumber, googleCalendarUrl, etc.

## Key Architecture Decisions

- **Google Calendar** is the source of truth for event dates. A Strapi proxy endpoint (`/api/calendar-proxy`) fetches the public iCal feed server-side to avoid CORS. Cache TTL: 30 min.
- **No user auth** — admin-only via Strapi admin panel. The public site is fully open.
- **Registration modal** saves to Strapi + sends confirmation email (Resend) to user + notification to admin.
- **Media hosting**: YouTube (videos), Spotify (audios), Strapi media library (PDFs with in-app viewer via react-pdf).
- **WhatsApp buttons**: Simple `wa.me` links with pre-filled messages. No API integration.
- **PDF viewer**: Lazy-loaded via `React.lazy()` only on document detail pages (react-pdf is ~2MB).

## Deployment

- Frontend: Vercel or Netlify (free tier)
- Backend: Railway (with UptimeRobot pinging every 5 min to prevent cold starts)

## File Conventions

- Components: PascalCase (`Button.tsx`, `EventCard.tsx`)
- Hooks: camelCase with `use` prefix (`useEvents.ts`)
- Utils: camelCase (`whatsapp.ts`, `dates.ts`)
- Types: defined in `frontend/src/types/index.ts`
- API layer: one file per resource in `frontend/src/api/`
