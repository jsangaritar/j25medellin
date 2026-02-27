# j25 Medellin — React + Vite + Strapi Web App

## Context

Build a web application for "J+25" (j25 Medellin), a faith-based young adult community in Medellin, Colombia. The app serves as a central hub for events, discipleship courses, and media content. The design exists as a complete `.pen` file with 17 screens (desktop + mobile) and 21 reusable components. The project directory is empty — everything is greenfield.

**Branding:**

- The group is called **J+25** but all user-facing copy in the app must say **"J+"** (not "J+25")
- Exception: site meta description can reference "J+25"
- Logo: `j25-logo.svg` (white SVG, already in project root) — must be used as the app logo in Header, Footer, and favicon

**Key decisions from user:**

- Monorepo (frontend + backend)
- Admin-only auth (Strapi admin panel)
- Google Calendar public feed as event source of truth
- External media hosting (YouTube, Spotify) + Strapi for PDFs
- Dark mode only, Spanish only
- Desktop + Tablet + Mobile breakpoints
- Resend for transactional emails
- Biome for linting/formatting, Vitest for testing

---

## 1. Monorepo Structure

```
j25medellin/
├── frontend/                    # React + Vite app
│   ├── public/
│   │   ├── favicon.ico          # Generated from j25-logo.svg
│   │   ├── j25-logo.svg         # Copied from root
│   │   └── og-image.png
│   ├── src/
│   │   ├── api/                 # API client & endpoint functions
│   │   │   ├── client.ts        # Base fetch wrapper (typed)
│   │   │   ├── events.ts        # Event API functions
│   │   │   ├── courses.ts       # Course API functions
│   │   │   ├── media.ts         # Media content API functions
│   │   │   ├── registrations.ts # Registration submissions
│   │   │   ├── calendar.ts      # Google Calendar proxy calls
│   │   │   └── site-config.ts   # Global site settings
│   │   ├── components/
│   │   │   ├── ui/              # Design system primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Tag.tsx
│   │   │   │   ├── FormField.tsx
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   ├── SectionHeader.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/          # Shared layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── PageBanner.tsx
│   │   │   │   ├── ContactCTA.tsx
│   │   │   │   └── RootLayout.tsx
│   │   │   └── features/        # Feature-specific components
│   │   │       ├── calendar/
│   │   │       │   ├── MonthlyCalendar.tsx
│   │   │       │   ├── CalendarCell.tsx
│   │   │       │   └── UpcomingHighlights.tsx
│   │   │       ├── events/
│   │   │       │   ├── FeaturedEvent.tsx
│   │   │       │   └── EventCard.tsx
│   │   │       ├── courses/
│   │   │       │   └── CourseCard.tsx
│   │   │       ├── media/
│   │   │       │   ├── ContentCard.tsx
│   │   │       │   ├── VideoPlayer.tsx
│   │   │       │   ├── AudioPlayer.tsx
│   │   │       │   └── PdfViewer.tsx
│   │   │       └── registration/
│   │   │           └── RegistrationModal.tsx
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useEvents.ts
│   │   │   ├── useCourses.ts
│   │   │   ├── useMedia.ts
│   │   │   ├── useCalendar.ts
│   │   │   └── useRegistration.ts
│   │   ├── pages/               # Route-level page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── DiscipuladosPage.tsx
│   │   │   ├── MediaPage.tsx
│   │   │   ├── EventosPage.tsx
│   │   │   ├── VideoDetailPage.tsx
│   │   │   ├── AudioDetailPage.tsx
│   │   │   └── DocumentDetailPage.tsx
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts         # Event, Course, MediaContent, Registration, SiteConfig
│   │   ├── utils/
│   │   │   ├── whatsapp.ts      # wa.me link builder
│   │   │   ├── dates.ts         # Date formatting (Spanish locale)
│   │   │   └── calendar.ts      # Calendar grid math
│   │   ├── App.tsx
│   │   ├── router.tsx           # React Router config
│   │   ├── main.tsx
│   │   └── index.css            # Tailwind v4 + theme tokens
│   ├── index.html
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
├── backend/                     # Strapi 5
│   ├── config/
│   │   ├── database.ts
│   │   ├── server.ts
│   │   ├── admin.ts
│   │   └── plugins.ts           # Resend email plugin config
│   ├── src/
│   │   ├── api/
│   │   │   ├── event/           # Event content type
│   │   │   ├── course/          # Course (Discipulado) content type
│   │   │   ├── media-content/   # Media content type
│   │   │   ├── registration/    # Registration + custom controller for emails
│   │   │   ├── site-config/     # Single type for global settings
│   │   │   └── calendar-proxy/  # Custom route: GET /api/calendar-proxy
│   │   └── extensions/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── biome.json                   # Shared Biome config (root level)
├── package.json                 # Root: scripts to run both apps
└── README.md
```

---

## 2. Strapi Content Types

### Event

| Field                 | Type                     | Notes                             |
| --------------------- | ------------------------ | --------------------------------- |
| title                 | String (required)        |                                   |
| slug                  | UID (from title)         |                                   |
| description           | Rich Text                |                                   |
| date                  | DateTime                 |                                   |
| endDate               | DateTime                 | Optional, for multi-day events    |
| location              | String                   |                                   |
| image                 | Media (single)           |                                   |
| tags                  | JSON (string array)      |                                   |
| featured              | Boolean (default: false) | Shown in featured banner          |
| requiresRegistration  | Boolean (default: false) |                                   |
| whatsappMessage       | String                   | Pre-filled message for wa.me link |
| googleCalendarEventId | String                   | Links to GCal event               |

### Course

| Field           | Type                                                  | Notes                    |
| --------------- | ----------------------------------------------------- | ------------------------ |
| title           | String (required)                                     |                          |
| slug            | UID (from title)                                      |                          |
| description     | Rich Text                                             |                          |
| image           | Media (single)                                        |                          |
| tags            | JSON (string array)                                   |                          |
| status          | Enum: DRAFT, COMING_SOON, ACTIVE, COMPLETED, ARCHIVED | Controls visibility      |
| startDate       | DateTime                                              |                          |
| endDate         | DateTime                                              |                          |
| schedule        | String                                                | e.g. "Miercoles 6:30 PM" |
| location        | String                                                |                          |
| whatsappMessage | String                                                |                          |

### MediaContent

| Field          | Type                         | Notes                      |
| -------------- | ---------------------------- | -------------------------- |
| title          | String (required)            |                            |
| slug           | UID (from title)             |                            |
| description    | Rich Text                    |                            |
| type           | Enum: VIDEO, AUDIO, DOCUMENT |                            |
| thumbnailImage | Media (single)               |                            |
| externalUrl    | String                       | YouTube/Spotify URL        |
| file           | Media (single)               | For PDF documents          |
| tags           | JSON (string array)          |                            |
| featured       | Boolean (default: false)     |                            |
| episodeCount   | Integer                      | Optional                   |
| platform       | String                       | "YouTube", "Spotify", etc. |

### Registration

| Field    | Type                        | Notes    |
| -------- | --------------------------- | -------- |
| fullName | String (required)           |          |
| whatsApp | String (required)           |          |
| email    | Email (required)            |          |
| event    | Relation (belongsTo Event)  | Optional |
| course   | Relation (belongsTo Course) | Optional |

### SiteConfig (Single Type)

| Field             | Type   | Notes                         |
| ----------------- | ------ | ----------------------------- |
| heroTitle         | String |                               |
| heroSubtitle      | Text   |                               |
| heroImage         | Media  |                               |
| whatsappNumber    | String | e.g. "+573001234567"          |
| instagramUrl      | String |                               |
| youtubeUrl        | String |                               |
| contactEmail      | String | Admin email for notifications |
| googleCalendarUrl | String | Public iCal/JSON feed URL     |

---

## 3. Frontend Architecture

### Routing (React Router v7, library mode)

```
/                          → HomePage
/discipulados              → DiscipuladosPage
/media                     → MediaPage
/media/video/:slug         → VideoDetailPage
/media/audio/:slug         → AudioDetailPage
/media/documento/:slug     → DocumentDetailPage
/eventos                   → EventosPage
```

All routes wrapped in `RootLayout` (Header + Footer + ContactCTA).

### State Management

- **TanStack Query (React Query)** for all server state (events, courses, media, calendar)
- **React state (useState)** for UI state (modal open/close, active filter tab, calendar month)
- No Redux/Zustand needed — this is a content-driven app with minimal client state

### API Layer

- `api/client.ts`: Base fetch wrapper with Strapi base URL, error handling, typed responses
- Each endpoint file exports functions + TanStack Query hooks
- Use `qs` library to build Strapi's nested query parameters
- Calendar proxy: `GET /api/calendar-proxy` endpoint in Strapi that fetches Google Calendar feed server-side (avoids CORS)

### CSS Approach: Tailwind CSS v4

- Map design tokens to Tailwind theme in `index.css` using `@theme`
- Custom properties for all design variables (colors, fonts, spacing)
- Responsive with 3 breakpoints: `sm:` (390px), `md:` (768px), `lg:` (1440px)

### Key Libraries

| Library                       | Purpose                      |
| ----------------------------- | ---------------------------- |
| react-router                  | Client-side routing          |
| @tanstack/react-query         | Server state management      |
| qs                            | Strapi query string building |
| react-pdf                     | PDF document viewer          |
| date-fns + date-fns/locale/es | Date formatting in Spanish   |
| tailwindcss v4                | Styling                      |

---

## 4. Google Calendar Integration

1. User provides their **public Google Calendar URL**
2. Strapi custom route `/api/calendar-proxy` fetches the iCal feed server-side
3. Parse iCal → JSON with `node-ical` in the Strapi controller
4. Return structured JSON: `{ events: [{ id, title, start, end, description }] }`
5. Frontend `useCalendar` hook fetches this endpoint with 30-min cache (`staleTime` in TanStack Query)
6. Calendar component maps events to date cells, showing dots/badges
7. Changes in Google Calendar reflect within 30 min (or immediately via manual cache refresh in Strapi admin)
8. All times displayed in America/Bogota timezone

---

## 5. Registration Flow

1. User clicks "Inscribirme" on a course or event
2. `RegistrationModal` opens (React portal) with form fields: Nombre, WhatsApp, Email
3. On submit → `POST /api/registrations` with `{ fullName, whatsApp, email, courseId?, eventId? }`
4. Strapi custom controller:
   a. Saves registration to database
   b. Sends **confirmation email** to user via Resend (includes course/event details)
   c. Sends **notification email** to admin (from SiteConfig.contactEmail)
5. Frontend shows success state in modal

---

## 6. Implementation Order

### Phase 1: Project Scaffolding

1. Init git repo
2. Create monorepo structure (`/frontend`, `/backend`, root `package.json`)
3. Scaffold Vite + React + TypeScript frontend
4. Scaffold Strapi 5 backend
5. Configure Biome (root-level `biome.json`)
6. Configure Vitest
7. Set up Tailwind v4 with design tokens from `.pen` file

### Phase 2: Design System Components

8. Implement UI primitives: Button, Tag, FormField, Modal, FilterBar, SectionHeader
9. Implement layout components: Header, Footer, PageBanner, ContactCTA, RootLayout
10. Set up routing with React Router

### Phase 3: Strapi Content Types

11. Create Event, Course, MediaContent, Registration content types
12. Create SiteConfig single type
13. Seed some sample data

### Phase 4: Homepage

14. Build Hero section
15. Build Calendar section (Google Calendar proxy + calendar grid)
16. Build Upcoming Highlights
17. Wire up to Strapi data

### Phase 5: Discipulados Page

18. Build course grid with status filtering (only show non-DRAFT, non-ARCHIVED)
19. Build CourseCard with status-aware UI
20. Implement RegistrationModal with Resend emails

### Phase 6: Media Hub

21. Build filter bar (Todos/Videos/Audios/Documentos)
22. Build content grid + featured section
23. Build detail pages: VideoDetailPage, AudioDetailPage, DocumentDetailPage
24. Integrate react-pdf for PDF viewer

### Phase 7: Eventos Page

25. Build FeaturedEvent banner
26. Build events grid with EventCards
27. Wire registration modal (for events that require it)

### Phase 8: Polish & Deploy

28. Responsive tablet breakpoint
29. Basic SEO meta tags
30. Deploy frontend to Vercel/Netlify
31. Deploy Strapi to Railway
32. Environment variables and production config

---

## Workflow

Each implementation step requires **user approval before committing**:

1. Implement the step
2. Present changes for user review
3. On approval → commit with descriptive message
4. Move to next step

---

## 7. Testing Strategy

- **Unit tests** (Vitest): Utility functions (date formatting, calendar math, WhatsApp link builder)
- **Component tests** (Vitest + React Testing Library): UI components render correctly, form validation works
- **Integration tests**: Registration flow (form → API call → success state)
- **No E2E tests initially** — add later if needed

---

## 8. Verification Plan

1. **Frontend**: Run `pnpm dev` in `/frontend`, verify all pages render with mock/seed data
2. **Backend**: Run `pnpm develop` in `/backend`, verify Strapi admin panel loads and content types exist
3. **API**: Test each endpoint via browser/curl: `/api/events`, `/api/courses`, `/api/media-contents`, `/api/calendar-proxy`
4. **Registration**: Submit form → verify Strapi saves it → verify emails sent (check Resend dashboard)
5. **Calendar**: Add event to Google Calendar → wait 5 min → verify it appears on website
6. **Responsive**: Test on desktop (1440px), tablet (768px), mobile (390px)
7. **Tests**: Run `pnpm test` from root, all tests pass
8. **Lint**: Run `pnpm check` (Biome), no errors

---

## 9. Risks & Mitigations

| Risk                                                  | Mitigation                                                                                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Calendar public feed may have rate limits      | Cache in Strapi with 30-min TTL (events change ~1-2x/month, ~300 users max). Add manual "refresh cache" endpoint in Strapi admin for immediate updates when needed. |
| Strapi Railway free tier spins down after inactivity  | Use UptimeRobot (free) to ping Strapi health endpoint every 7 min, keeping the instance warm.                                                                       |
| react-pdf bundle size is large (~2MB)                 | Lazy-load the PDF viewer only on document detail pages via `React.lazy()`.                                                                                          |
| Resend free tier (100 emails/day) limit               | Sufficient — expected max is ~80 emails/day. No upgrade needed.                                                                                                     |
| iCal parsing edge cases (recurring events, timezones) | Use `node-ical` which handles RRULE and timezone conversion. All times displayed in America/Bogota timezone since the community is local.                           |
