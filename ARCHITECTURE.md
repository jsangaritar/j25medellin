# Architecture

## Tech Stack

- **Frontend**: React 19 + Vite 6 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **State**: TanStack Query v5 (server state), React useState (UI state)
- **Routing**: React Router v7 (library mode, SPA with `createBrowserRouter`)
- **Backend**: Firebase (Firestore, Auth) — Spark (free) plan only
- **Serverless**: Vercel Serverless Functions (5 endpoints)
- **Email**: Resend (confirmation + contact forwarding, via Vercel serverless)
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting/Formatting**: Biome 2
- **Package Manager**: pnpm
- **Icons**: lucide-react
- **Dates**: date-fns

## Project Structure

```
j25medellin/
├── public/              # Static assets (logo, favicon, event images)
├── src/
│   ├── app/             # Entry point (main.tsx), providers, router
│   ├── components/
│   │   ├── ui/          # shadcn/ui + custom (DataTable, OptimizedImage, ConfirmDelete)
│   │   ├── layout/      # Header, Footer, RootLayout, ContactCTA, PageBanner
│   │   └── features/    # calendar/, contact/, courses/, events/, hero/, media/, registration/
│   ├── pages/           # Public route pages
│   │   └── admin/       # Admin pages (behind Firebase Auth)
│   ├── lib/             # firebase.ts, firestore.ts, auth.ts, storage.ts, sync-calendar.ts, utils.ts
│   ├── hooks/           # useEvents, useCourses, useMedia, useAuth, useSiteConfig, etc.
│   ├── types/           # TypeScript interfaces (index.ts)
│   ├── utils/           # whatsapp.ts, dates.ts, calendar.ts, media.ts
│   ├── mocks/           # MSW handlers + mock data
│   └── vite-api-plugin.ts  # Dev middleware replicating Vercel endpoints
├── api/                 # Vercel Serverless Functions (5 endpoints)
├── docs/                # PRD, Design Doc, Implementation Plan
└── j25medellin.pen      # Design spec (source of truth for UI)
```

## Design Tokens

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

## Routes

### Public

| Path | Page | Notes |
|------|------|-------|
| `/` | HomePage | Hero + monthly calendar + upcoming highlights |
| `/eventos` | EventosPage | Featured event + upcoming events grid |
| `/discipulados` | DiscipuladosPage | Topics grouped by status (Active, Coming Soon, Completed) |
| `/media` | MediaPage | Tabbed (All/Videos/Audios/Documents) + featured section |
| `/media/video/:slug` | VideoDetailPage | YouTube embed + related media |
| `/media/audio/:slug` | AudioDetailPage | Spotify/external player + related media |
| `/media/documento/:slug` | DocumentDetailPage | Lazy-loaded react-pdf viewer + related media |
| `*` | NotFoundPage | 404 catch-all |

### Admin (protected by Firebase Auth)

| Path | Page | Notes |
|------|------|-------|
| `/admin/login` | LoginPage | Email/password sign in |
| `/admin` | DashboardPage | 4 stat cards (events, courses, media, registrations) |
| `/admin/events` | EventsAdminPage | CRUD + Google Calendar sync |
| `/admin/topics` | TopicsAdminPage | CRUD for course topics |
| `/admin/courses` | CoursesAdminPage | CRUD with topic assignment |
| `/admin/media` | MediaAdminPage | CRUD with type selector |
| `/admin/registrations` | RegistrationsPage | View, create, delete (with enrolled decrement) + CSV export |
| `/admin/settings` | SiteConfigPage | Hero, WhatsApp, social links, contact email |

## API Endpoints

All endpoints live in `api/` and are replicated in `src/vite-api-plugin.ts` for local dev.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/calendar` | No | Fetches dual Google Calendar iCal feeds (J+ and church). Cache: 12h. |
| POST | `/api/register` | No | Event/course registration. Course: atomic transaction with capacity check + topic duplicate detection + enrolled increment. Sends confirmation email. |
| POST | `/api/sync-calendar` | Admin | Syncs Google Calendar events to Firestore. Creates or updates events by `googleCalendarEventId`. |
| POST | `/api/contact` | No | Saves contact message to Firestore + forwards email to admin. |
| DELETE | `/api/delete-registration` | Admin | Deletes registration. If course registration: atomic transaction to decrement `enrolled`. |

## Data Models (Firestore)

### Event

`id`, `title`, `slug`, `description`, `date` (ISO), `endDate?`, `location`, `imageUrl?`, `tags[]`, `featured`, `requiresRegistration`, `whatsappMessage?`, `googleCalendarEventId?`, `eventType` (`'j+'` | `'church'`)

### Course

`id`, `title`, `slug`, `description`, `imageUrl?`, `tags[]`, `startDate?`, `endDate?`, `schedule?`, `location?`, `whatsappMessage?`, `accentColor?`, `capacity?`, `enrolled?`, `topicId`

### Topic (collection: `courseTopics`)

`id`, `title`, `description`, `tag`, `startDate`, `endDate`, `status` (DRAFT/COMING_SOON/ACTIVE/COMPLETED/ARCHIVED), `courseIds[]`

### MediaContent

`id`, `title`, `slug`, `description`, `type` (VIDEO/AUDIO/DOCUMENT), `thumbnailUrl?`, `externalUrl?`, `fileUrl?`, `tags[]`, `featured`, `platform?`, `topicId?`, `courseId?`

### Registration

`id`, `fullName`, `whatsApp`, `email`, `eventId?`, `courseId?`, `createdAt`

Course registrations use a deterministic doc ID: `{courseId}_{normalizedEmail}`

### ContactMessage

`id`, `fullName`, `whatsApp`, `email`, `message`, `createdAt`

### SiteConfig (single doc at `settings/config`)

`heroTitle`, `heroSubtitle`, `heroImageUrl?`, `whatsappNumber`, `instagramUrl`, `youtubeUrl`, `contactEmail`

## Architecture Decisions

- **Firebase Spark (free) plan** — no Cloud Functions. All server-side logic runs as Vercel Serverless Functions.
- **Google Calendar** is the source of truth for event dates. Admin syncs via `/api/sync-calendar`. The `/api/calendar` endpoint fetches dual iCal feeds (J+ and church) for the public calendar view.
- **No user auth** — admin-only via Firebase Auth (`signInWithEmailAndPassword`). The public site is fully open.
- **Course registration** is transactional: atomic capacity check + enrolled increment + topic-level duplicate detection (one user can't register for two courses under the same topic).
- **Registration deletion** is also transactional: decrements `enrolled` on the parent course when a course registration is deleted.
- **Media hosting**: YouTube (videos), Spotify (audios — supports podcasts, playlists, albums), Firebase Storage (PDFs with react-pdf viewer).
- **WhatsApp buttons**: Simple `wa.me` links with pre-filled messages. No API integration.
- **Images**: Stored as URL strings. Google Drive URLs auto-converted to `lh3.googleusercontent.com` fetchable format. `OptimizedImage` component handles lazy loading, shimmer placeholder, fade-in, and error fallback.
- **PDF viewer**: Lazy-loaded via `React.lazy()` only on document detail pages (react-pdf is ~2MB).
- **Lazy loading**: HomePage is eager-loaded; all other public pages and all admin pages are lazy-loaded with `Suspense` + skeleton fallback.
- **Dev API middleware** (`src/vite-api-plugin.ts`): Replicates all 5 Vercel serverless endpoints locally so `pnpm dev` works without `vercel dev`.
- **Empty states**: Every feature has a meaningful empty state when no data exists.
- **404 handling**: Media detail pages show "not found" when slug doesn't match. Global catch-all 404 page.

## UI Patterns

### Admin Pages

All admin pages follow the same structure:
1. Data fetched via custom hook (e.g., `useEvents()`)
2. `DataTable` with sortable columns, debounced search filter
3. Create/Edit via `Dialog` with form
4. Delete via `ConfirmDelete` dialog (always confirm before deleting)
5. `useMutation` + `useQueryClient.invalidateQueries` for CRUD operations

### DataTable Component (`src/components/ui/data-table.tsx`)

Generic `DataTable<T>` with:
- Column definition: `key`, `label`, `render`, `sortValue?`, `filterValue?`, `className?`
- Click-to-sort headers (asc/desc toggle)
- Debounced search filter (250ms)
- Empty state handling

### OptimizedImage Component (`src/components/ui/optimized-image.tsx`)

- Lazy loading with `loading="lazy"`
- Shimmer placeholder while loading
- Fade-in transition on load
- Built-in error fallback (customizable via `fallback` prop)
- `referrerPolicy="no-referrer"` on all images

### Related Media Matching (`src/utils/media.ts`)

Smart scoring algorithm for "related content" on media detail pages. Matches by shared course, topic, tags, and type with weighted scoring.

## Hooks

| Hook | Source | Purpose |
|------|--------|---------|
| `useEvents(filters?)` | Firestore | All events, optional `featured` filter |
| `useFeaturedEvents()` | Firestore | Shorthand for featured events |
| `useCourses()` | Firestore | All courses |
| `useMedia(filters?)` | Firestore | Filter by `type` and/or `featured` |
| `useMediaBySlug(slug)` | Firestore | Single media item by slug |
| `useSiteConfig()` | Firestore | Site config singleton |
| `useAuth()` | Context | Auth state + current user |
| `useRegistration()` | API | Mutation for POST `/api/register` |
| `useContact()` | API | Mutation for POST `/api/contact` |
| `useIsMobile()` | Media query | Responsive breakpoint detection |

Course topics are queried directly in components via `useQuery` (in `useCourses.ts`): `useCourseTopic()`, `useAllCourseTopics()`, `useTopics()`.

## File Conventions

- Components: PascalCase (`Button.tsx`, `EventCard.tsx`)
- Hooks: camelCase with `use` prefix (`useEvents.ts`)
- Utils: camelCase (`whatsapp.ts`, `dates.ts`)
- Types: defined in `src/types/index.ts`
- Firebase helpers: in `src/lib/`
- API endpoints: in `api/` (Vercel convention)
- Biome formatting: single quotes, 2-space indent, 80-char line width, always semicolons

## Deployment

- **Frontend + Serverless**: Vercel (auto-deploys from `main`)
- **Database + Auth**: Firebase (Firestore, Auth)
- **SPA routing**: `vercel.json` rewrites all non-API routes to `/index.html`
- **Build chunks**: Firebase SDK, vendor (React/Router/Query), and feature pages split into separate chunks
