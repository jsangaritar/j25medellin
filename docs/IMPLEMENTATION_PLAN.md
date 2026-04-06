# J+ Medellin — Implementation Plan

Each phase is independently committable and reviewable.

---

## Phase 0: Documentation & Clean Slate

**Goal**: Save PRD, Design Doc, and Implementation Plan as separate files in `docs/`, then remove all existing code.

1. Create `docs/PRD.md`, `docs/DESIGN.md`, `docs/IMPLEMENTATION_PLAN.md`
2. Remove `frontend/`, `backend/`, old config files
3. Keep only: `j25medellin.pen`, `j25-logo.svg`, `docs/`, `.git/`, `.gitignore`

---

## Phase 1: Project Scaffolding & Tooling

**Goal**: Empty project that builds, lints, and runs with design system configured.

1. Initialize Vite + React 19 + TypeScript project
2. Install & configure Tailwind CSS v4 with `@tailwindcss/vite`
3. Initialize shadcn/ui (New York style, dark mode only)
4. Map all `.pen` design tokens to `index.css` (both shadcn vars and custom vars)
5. Import Google Fonts (Montserrat 700,800 + Inter 400,500,600,700) in `index.html`
6. Configure Biome (single quotes, spaces, 80 line width)
7. Configure Vitest with jsdom
8. Set up path aliases (`@/` -> `src/`)
9. Create `.env.example` with Firebase config placeholders
10. Create Firebase config files (`firebase.json`, `firestore.rules`, `storage.rules`)
11. Update `CLAUDE.md` with new stack info

**Key files**: `package.json`, `vite.config.ts`, `tsconfig.json`, `biome.json`, `components.json`, `src/index.css`, `index.html`

---

## Phase 2: Firebase Setup, Data Layer & MSW

**Goal**: Firebase initialized, typed Firestore helpers, types, mock data, MSW for development/testing.

1. Create `src/lib/firebase.ts` — init Firebase app from env vars
2. Create `src/types/index.ts` — all interfaces (no Strapi wrappers, string IDs, string URLs)
3. Create `src/lib/firestore.ts` — typed read/write helpers for each collection
4. Create `src/lib/storage.ts` — upload/delete helpers
5. Create `src/lib/auth.ts` — sign in/out, auth state listener
6. Port `src/mocks/data.ts` — adapt to new types (string URLs, no StrapiMedia)
7. Set up MSW (Mock Service Worker):
   - `src/mocks/handlers.ts` — request handlers returning mock data for all Firestore reads
   - `src/mocks/browser.ts` — MSW browser worker (for `pnpm dev` with `VITE_USE_MOCKS=true`)
   - `src/mocks/server.ts` — MSW server (for Vitest tests)
   - Conditional init in `main.tsx` (only start MSW worker when env var is set)
8. Write `firestore.rules` and `storage.rules`

**Key files**: `src/lib/firebase.ts`, `src/lib/firestore.ts`, `src/types/index.ts`, `src/mocks/*`

---

## Phase 3: Design System Components

**Goal**: All reusable UI components matching the `.pen` design.

1. Add shadcn/ui components: `button`, `dialog`, `input`, `label`, `tabs`, `badge`, `card`, `separator`, `select`, `textarea`, `table`, `form`, `dropdown-menu`, `sheet`
2. Customize Button with app-specific variants (primary green, secondary, ghost)
3. Create custom `Tag` component
4. Create custom `FormField` (shadcn Input + Label + icon)
5. Create custom `FilterBar` using shadcn Tabs
6. Create custom `SectionHeader`
7. Verify all components render correctly with design tokens

**Key files**: `src/components/ui/*` (shadcn), custom components in same directory

---

## Phase 4: Layout & Routing

**Goal**: App shell with Header, Footer, routing for all pages (rendering placeholder content).

1. Create `Header.tsx` — nav (Inicio, Discipulados, Media, Eventos), mobile menu via shadcn Sheet, WhatsApp CTA button
2. Create `Footer.tsx` — logo, social links, copyright
3. Create `ContactCTA.tsx` — WhatsApp + form CTA section
4. Create `PageBanner.tsx` — reusable page header with tag, title, subtitle
5. Create `RootLayout.tsx` — Header + Outlet + ContactCTA + Footer
6. Create `router.tsx` — all public + admin routes
7. Create `App.tsx` with QueryClientProvider + RouterProvider
8. Create `providers.tsx` with AuthProvider context
9. Create `AdminLayout.tsx` with auth guard
10. Create placeholder pages that render their name
11. Create `NotFoundPage.tsx` — generic 404 page for unmatched routes
12. Create reusable `EmptyState` component — used when a collection has no data

**Routes**: `/`, `/discipulados`, `/media`, `/media/video/:slug`, `/media/audio/:slug`, `/media/documento/:slug`, `/eventos`, `/admin`, `/admin/login`, `/admin/events`, `/admin/courses`, `/admin/media`, `/admin/registrations`, `/admin/settings`, `*` (catch-all -> NotFoundPage)

**Key files**: `src/components/layout/*`, `src/app/router.tsx`, `src/app/App.tsx`

---

## Phase 5: Home Page

**Goal**: Complete homepage with Hero, Calendar, Upcoming Highlights.

1. Create `useSiteConfig` hook — fetches `settings/config` from Firestore
2. Create `useCalendar` hook — fetches calendar events (mock initially, Cloud Function later)
3. Port `HeroSection.tsx` — hero bg, gradient overlay, title, subtitle, CTA
4. Port `MonthlyCalendar.tsx` — monthly grid with nav, event indicators
5. Port `CalendarCell.tsx` — day cell with event count
6. Port `UpcomingHighlights.tsx` — upcoming events list
7. Port `utils/calendar.ts` and `utils/dates.ts` (pure functions, copy directly)
8. Assemble `HomePage.tsx`
9. Add empty state for calendar (no events this month) and upcoming highlights (no upcoming events)

**Key files**: `src/pages/HomePage.tsx`, `src/components/features/hero/*`, `src/components/features/calendar/*`, `src/hooks/useSiteConfig.ts`, `src/hooks/useCalendar.ts`

---

## Phase 6: Eventos Page

**Goal**: Events listing with featured banner and event grid.

1. Create `useEvents` hook — Firestore query with featured filter
2. Port `FeaturedEvent.tsx` — large featured event with image, date, tags
3. Port `EventCard.tsx` — event card with date badge, title, location, tags
4. Port `utils/whatsapp.ts` (pure function, copy directly)
5. Assemble `EventosPage.tsx`
6. Add empty state when there are no events

**Key files**: `src/pages/EventosPage.tsx`, `src/components/features/events/*`, `src/hooks/useEvents.ts`

---

## Phase 7: Discipulados Page

**Goal**: Discipleship page with quarterly banner, course cards, registration modal.

1. Create `useCourses` + `useCourseTopic` hooks — Firestore queries
2. Create `useRegistration` hook — mutation that calls Firestore addDoc
3. Port `QuarterlyBanner.tsx` — theme banner with title, description, date range
4. Port `CourseCard.tsx` — card with line number, accent color, progress bar, capacity
5. Port `RegistrationModal.tsx` — form using shadcn Dialog + Input, saves to Firestore
6. Assemble `DiscipuladosPage.tsx`
7. Add empty state when there are no active courses/topics

**Key files**: `src/pages/DiscipuladosPage.tsx`, `src/components/features/courses/*`, `src/components/features/registration/*`

---

## Phase 8: Media Hub & Detail Pages

**Goal**: Media listing with filters, all three detail page types.

1. Create `useMedia` + `useMediaBySlug` hooks — Firestore queries with type/featured filters
2. Port `ContentCard.tsx` — adaptive card (vertical desktop, list mobile)
3. Assemble `MediaPage.tsx` with FilterBar (shadcn Tabs)
4. Port `VideoDetailPage.tsx` — YouTube embed + related videos sidebar
5. Port `AudioDetailPage.tsx` — Spotify embed + episode listing
6. Port `DocumentDetailPage.tsx` — lazy-loaded react-pdf viewer + related docs
7. Simplify `utils/media.ts` (remove Strapi URL helpers)
8. Add empty state for media listing when no content exists
9. Add 404/Not Found state on all detail pages (Video, Audio, Document) when slug doesn't match any content — show friendly "content not found" with link back to media hub

**Key files**: `src/pages/MediaPage.tsx`, `src/pages/VideoDetailPage.tsx`, `src/pages/AudioDetailPage.tsx`, `src/pages/DocumentDetailPage.tsx`, `src/components/features/media/*`

---

## Phase 9: Vercel Serverless Functions (replaces Firebase Cloud Functions)

**Goal**: Server-side calendar proxy and email notifications using Vercel Serverless Functions (free tier).

> **Why not Firebase Cloud Functions?** The Spark (free) plan does not support Cloud Functions deployment. Since the frontend deploys to Vercel, we use Vercel's built-in serverless functions at zero cost.

1. Create `api/` directory at project root for Vercel serverless functions
2. Implement `api/calendar.ts` — fetches Google Calendar iCal URL, parses with `node-ical`, returns JSON. Uses in-memory cache with 30-min TTL.
3. Implement `api/register.ts` — receives registration data, writes to Firestore via Firebase Admin SDK, sends confirmation email via Resend
4. Configure `firebase-admin` with service account env var for server-side Firestore access
5. Update `useCalendar` hook to call `/api/calendar`
6. Update `useRegistration` hook to POST to `/api/register` instead of direct Firestore write
7. Add `vercel.json` with rewrites for SPA + API routes

**Dependencies** (devDependencies for API routes): `node-ical`, `resend`, `firebase-admin`

**Key files**: `api/calendar.ts`, `api/register.ts`, `vercel.json`

---

## Phase 10: Admin Panel

**Goal**: Full CRUD admin interface for all content types.

1. Create `LoginPage.tsx` — email/password form
2. Wire `AuthProvider` + `useAuth` hook with `onAuthStateChanged`
3. Create `AdminLayout.tsx` — sidebar nav, auth guard (redirect to login)
4. Create `DashboardPage.tsx` — overview counts
5. Create `EventsAdminPage.tsx` — table + create/edit dialog + delete
6. Create `CoursesAdminPage.tsx` — table + CRUD + topic management
7. Create `MediaAdminPage.tsx` — table + CRUD + file upload via Firebase Storage
8. Create `RegistrationsPage.tsx` — read-only table + CSV export
9. Create `SiteConfigPage.tsx` — single settings form

All admin pages follow the same pattern: shadcn Table + Dialog + Form.

**Key files**: `src/pages/admin/*`

---

## Phase 11: Testing

**Goal**: Unit + component tests for critical paths.

1. Port utility tests: `calendar.test.ts`, `dates.test.ts`, `whatsapp.test.ts`
2. Component tests: RegistrationModal (validation, submit), FilterBar (tab switching), CalendarCell
3. Hook tests with mocked Firestore (using MSW server)
4. Integration test: registration flow end-to-end

---

## Phase 12: Deployment & Polish

**Goal**: Production-ready on Vercel + Firebase.

1. Configure Vercel project with Firebase env vars
2. Add `vercel.json` with SPA rewrite rules
3. Deploy Cloud Functions to production
4. Set up Firestore indexes (composite indexes for filtered queries)
5. Add per-page SEO meta tags
6. Lazy-load admin routes + react-pdf via `React.lazy()`
7. Verify responsive design at all 3 breakpoints
8. Seed Firestore with initial content

---

## Verification

After each phase:
- `pnpm dev` — app runs without errors
- `pnpm check` — Biome passes (lint + format)
- `pnpm test` — all tests pass (from Phase 11 onward)
- Visual check at 390px, 768px, 1440px (for UI phases)

End-to-end verification:
- Public pages render with Firestore data
- Registration modal submits to Firestore
- Calendar shows Google Calendar events
- Admin can log in and CRUD all content types
- Email sends on registration
- Vercel deployment serves the SPA correctly
