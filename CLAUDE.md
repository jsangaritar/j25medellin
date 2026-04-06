# CLAUDE.md — J+ Medellin Project

## Project Overview

Web app for "J+" (J+25 Medellin), a faith-based young adult community in Medellin, Colombia. Central hub for events, discipleship courses, and media content.

## Tech Stack

- **Frontend**: React 19 + Vite 7 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **State**: TanStack Query v5 (server state), React useState (UI state)
- **Routing**: React Router v7 (library mode)
- **Backend**: Firebase (Firestore, Storage, Auth) — Spark (free) plan only
- **Serverless**: Vercel Serverless Functions (calendar proxy, registration + email)
- **Email**: Resend (via Vercel Serverless Function)
- **Mocking**: MSW (Mock Service Worker) for dev and tests
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting/Formatting**: Biome 2.4
- **Package Manager**: pnpm (single project, not monorepo)

## Project Structure

```
j25medellin/
├── public/             # Static assets (logo, favicon)
├── src/
│   ├── app/            # Entry point, providers, router
│   ├── components/
│   │   ├── ui/         # shadcn/ui components
│   │   ├── layout/     # Header, Footer, RootLayout, ContactCTA, PageBanner
│   │   └── features/   # calendar/, events/, courses/, media/, registration/
│   ├── pages/          # Route pages + admin/
│   ├── lib/            # firebase.ts, firestore.ts, storage.ts, auth.ts
│   ├── hooks/          # useEvents, useCourses, useMedia, useCalendar, etc.
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # whatsapp, dates, calendar helpers
│   └── mocks/          # MSW handlers + mock data
├── api/                # Vercel Serverless Functions (calendar, register)
├── docs/               # PRD, Design Doc, Implementation Plan
└── j25medellin.pen     # Design spec (source of truth for UI)
```

## Branding

- The group is called **J+25** but all user-facing copy must say **"J+"**
- Exception: site meta description can reference "J+25"
- Logo: `j25-logo.svg` (white SVG) — used in Header, Footer, favicon
- Language: **Spanish only** (no i18n)
- Theme: **Dark mode only**

## Design Tokens (from j25medellin.pen)

### Colors
- Accent: `#4ADE80` (bright green), `#22C55E` (muted), `#16A34A1A` (dim/transparent), `#2D5A27` (dark)
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

## Commands

```bash
pnpm dev              # Start frontend dev server
pnpm build            # Build frontend for production
pnpm test             # Run tests (Vitest)
pnpm check            # Run Biome lint + format check
pnpm check:fix        # Auto-fix Biome issues
```

## Before Committing

Always run `pnpm check` before committing. If there are fixable issues, run `pnpm check:fix` first.

## Key Architecture Decisions

- **Firebase Spark (free) plan only** — no Cloud Functions. Vercel Serverless Functions used instead.
- **Google Calendar** is the source of truth for event dates. A Vercel serverless function (`/api/calendar`) fetches the public iCal feed server-side to avoid CORS. Cache TTL: 30 min.
- **No user auth** — admin-only via Firebase Auth. The public site is fully open.
- **Registration** POST goes to `/api/register` (Vercel serverless), which writes to Firestore via firebase-admin and sends confirmation email (Resend).
- **Media hosting**: YouTube (videos), Spotify (audios), Firebase Storage (PDFs with react-pdf viewer).
- **WhatsApp buttons**: Simple `wa.me` links with pre-filled messages. No API integration.
- **PDF viewer**: Lazy-loaded via `React.lazy()` only on document detail pages (react-pdf is ~2MB).
- **MSW**: Used for development without Firebase backend and for test suites.
- **Images**: Stored as plain URL strings (Firebase Storage download URLs).
- **Empty states**: Every feature has a meaningful empty state when no data exists.
- **404 handling**: Media detail pages show "not found" when slug doesn't match. Global catch-all 404 page.

## Content Types (Firestore)

- **Event**: title, slug, description, date, location, imageUrl, tags, featured, requiresRegistration
- **Course**: title, slug, description, imageUrl, tags, status (DRAFT/COMING_SOON/ACTIVE/COMPLETED/ARCHIVED), capacity, enrolled
- **CourseTopic**: title, description, tag, startDate, endDate, courseIds[]
- **MediaContent**: title, slug, description, type (VIDEO/AUDIO/DOCUMENT), externalUrl, fileUrl, featured
- **Registration**: fullName, whatsApp, email, eventId?, courseId?
- **SiteConfig** (single doc at `settings/config`): heroTitle, heroSubtitle, whatsappNumber, googleCalendarUrl, etc.

## File Conventions

- Components: PascalCase (`Button.tsx`, `EventCard.tsx`)
- Hooks: camelCase with `use` prefix (`useEvents.ts`)
- Utils: camelCase (`whatsapp.ts`, `dates.ts`)
- Types: defined in `src/types/index.ts`
- Firebase helpers: in `src/lib/`

## Deployment

- Frontend: Vercel
- Backend: Firebase (Firestore, Storage, Cloud Functions)
