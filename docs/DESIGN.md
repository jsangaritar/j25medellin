# J+ Medellin — Design Document

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (New York style) |
| Routing | React Router v7 (library mode) |
| Server State | TanStack Query v5 |
| Database | Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Auth (admin only) |
| Functions | Vercel Serverless Functions (calendar proxy, email) |
| Email | Resend (via Vercel Serverless Function) |
| Icons | lucide-react |
| Dates | date-fns |
| PDF | react-pdf (lazy-loaded) |
| Mocking | MSW (Mock Service Worker) |
| Linting | Biome 2.4 |
| Testing | Vitest + React Testing Library |
| Package Manager | pnpm |
| Hosting | Vercel |

## 2. Project Structure

```
j25medellin/
├── public/
│   ├── j25-logo.svg
│   └── favicon.ico
├── src/
│   ├── app/                    # Entry point, providers, router
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui generated components
│   │   ├── layout/             # Header, Footer, RootLayout, ContactCTA, PageBanner
│   │   └── features/           # calendar/, events/, courses/, media/, registration/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── EventosPage.tsx
│   │   ├── DiscipuladosPage.tsx
│   │   ├── MediaPage.tsx
│   │   ├── VideoDetailPage.tsx
│   │   ├── AudioDetailPage.tsx
│   │   ├── DocumentDetailPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── LoginPage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── EventsAdminPage.tsx
│   │       ├── CoursesAdminPage.tsx
│   │       ├── MediaAdminPage.tsx
│   │       ├── RegistrationsPage.tsx
│   │       └── SiteConfigPage.tsx
│   ├── lib/
│   │   ├── firebase.ts         # Firebase init
│   │   ├── firestore.ts        # Typed Firestore helpers
│   │   ├── storage.ts          # Upload/delete helpers
│   │   └── auth.ts             # Auth helpers
│   ├── hooks/                  # useEvents, useCourses, useMedia, useCalendar, etc.
│   ├── types/                  # TypeScript interfaces
│   ├── utils/                  # whatsapp, dates, calendar, media helpers
│   └── mocks/                  # MSW handlers + mock data
│       ├── handlers.ts         # MSW request handlers
│       ├── browser.ts          # MSW browser worker setup
│       ├── data.ts             # Mock data fixtures
│       └── server.ts           # MSW server for tests
├── api/                        # Vercel Serverless Functions
│   ├── calendar.ts             # Google Calendar iCal proxy
│   └── register.ts             # Registration + email via Resend
├── index.html
├── src/index.css               # Tailwind v4 + design tokens + shadcn CSS vars
├── vite.config.ts
├── tsconfig.json
├── biome.json
├── components.json             # shadcn/ui config
├── firebase.json
├── firestore.rules
├── storage.rules
├── .env.example
├── CLAUDE.md
└── package.json
```

## 3. Design Token Mapping

Source: `j25medellin.pen` design file.

### 3.1 Colors

| Token | Value | shadcn Variable |
|-------|-------|-----------------|
| `--accent-bright` | `#4ADE80` | `--primary`, `--accent`, `--ring` |
| `--accent-muted` | `#22C55E` | (custom only) |
| `--accent-dim` | `#16A34A1A` | (custom only) |
| `--accent` | `#2D5A27` | (custom only) |
| `--bg-primary` | `#0A0A0A` | `--background` |
| `--bg-surface` | `#141414` | `--muted`, `--popover` |
| `--bg-card` | `#1A1A1A` | `--card` |
| `--bg-elevated` | `#222222` | `--secondary` |
| `--bg-white` | `#FFFFFF` | (custom only) |
| `--text-primary` | `#FAFAFA` | `--foreground`, `--card-foreground` |
| `--text-secondary` | `#A1A1AA` | `--secondary-foreground` |
| `--text-muted` | `#71717A` | `--muted-foreground` |
| `--text-dim` | `#3F3F46` | (custom only) |
| `--border` | `#27272A` | `--border`, `--input` |
| `--border-light` | `#1E1E1E` | (custom only) |

### 3.2 Typography

| Usage | Font | Weights |
|-------|------|---------|
| Display/Headings | Montserrat | 700 (Bold), 800 (ExtraBold) |
| Body | Inter | 400, 500, 600, 700 |

### 3.3 Breakpoints

| Name | Width | Tailwind Prefix |
|------|-------|-----------------|
| Mobile | 390px | `sm:` |
| Tablet | 768px | `md:` |
| Desktop | 1440px | `lg:` |

## 4. Component Mapping (Current to New)

| Current Component | New Approach |
|-------------------|-------------|
| `Button.tsx` | shadcn/ui `Button` with custom variants |
| `Modal.tsx` | shadcn/ui `Dialog` (Radix-based, better a11y) |
| `FormField.tsx` | shadcn/ui `Input` + `Label` + custom icon wrapper |
| `FilterBar.tsx` | shadcn/ui `Tabs` component |
| `Tag.tsx` | shadcn/ui `Badge` customized |
| `SectionHeader.tsx` | Keep custom (too specific) |
| `EmptyState` (new) | Reusable empty state with icon, title, description |
| All feature components | Port with image URL simplification (string instead of StrapiMedia) |

## 5. API Layer Architecture

### Old (Strapi)
`fetch()` → Strapi REST API → `qs` query builder → `StrapiResponse<T>` unwrapping

### New (Firebase)
Firestore SDK → typed helper functions → direct document data

```
src/lib/firestore.ts
  ├── getEvents(filters?) → Event[]
  ├── getEventBySlug(slug) → Event | null
  ├── getCourses(filters?) → Course[]
  ├── getCourseTopic() → CourseTopic | null
  ├── getMediaContents(filters?) → MediaContent[]
  ├── getMediaBySlug(slug) → MediaContent | null
  ├── getSiteConfig() → SiteConfig
  ├── createRegistration(data) → Registration
  └── CRUD operations for admin...
```

TanStack Query hooks remain the same pattern — they call Firestore helpers instead of REST endpoints.

## 6. Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read on content collections
    match /events/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /courses/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /courseTopics/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /mediaContents/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /settings/{doc} { allow read: if true; allow write: if request.auth != null; }
    // Registrations: public create, admin read
    match /registrations/{doc} { allow create: if true; allow read: if request.auth != null; }
  }
}
```

## 7. Serverless Functions (Vercel)

> Firebase Spark (free) plan does not support Cloud Functions. Vercel Serverless Functions are used instead — included free with Vercel hosting.

1. **`api/calendar.ts`** (GET): Fetches Google Calendar iCal URL → parses with `node-ical` → returns JSON. In-memory cache with 30-min TTL via `Cache-Control` headers.
2. **`api/register.ts`** (POST): Receives registration data, writes to Firestore via `firebase-admin` SDK (service account), sends confirmation email via Resend SDK.

## 8. Key Architecture Decisions

- **Google Calendar** is the source of truth for event dates. A Vercel serverless function (`/api/calendar`) fetches the public iCal feed server-side to avoid CORS. Cache TTL: 30 min via `Cache-Control: s-maxage=1800`.
- **No user auth** — admin-only via Firebase Auth. The public site is fully open.
- **Registration** saves to Firestore via `/api/register` serverless function, which also sends confirmation email (Resend) to user + notification to admin.
- **Media hosting**: YouTube (videos), Spotify (audios), Firebase Storage (PDFs with in-app viewer via react-pdf).
- **WhatsApp buttons**: Simple `wa.me` links with pre-filled messages. No API integration.
- **PDF viewer**: Lazy-loaded via `React.lazy()` only on document detail pages (react-pdf is ~2MB).
- **MSW**: Mock Service Worker for development without Firebase and for test suites.
- **Images**: Stored as plain URL strings (Firebase Storage download URLs), not wrapped objects.
