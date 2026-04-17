# J+ Medellin — Product Requirements Document

## 1. Product Overview

**J+ Medellin** is a community hub for a faith-based young adult ministry in Medellin, Colombia. It serves as the central platform for events, discipleship courses, and media content.

- **Language**: Spanish only (no i18n)
- **Theme**: Dark mode only
- **Auth**: Admin-only (Firebase Auth) — public site is fully open
- **Brand**: User-facing copy says "J+" (not "J+25"). Exception: site meta description can reference "J+25"
- **Logo**: `j25-logo.svg` (white SVG) — used in Header, Footer, favicon

## 2. Target Users

| User | Needs |
|------|-------|
| **Community members** (young adults) | Browse events, register for courses, consume media content, contact via WhatsApp |
| **Admin** (ministry leaders) | Create/edit events, courses, media content. View registrations. Update site config |

## 3. Pages & Features

### 3.1 Public Pages

| Page | Route | Features |
|------|-------|----------|
| **Home** | `/` | Hero section with CTA, Monthly calendar (Google Calendar sync), Upcoming event highlights, Contact CTA |
| **Eventos** | `/eventos` | Featured event banner, Event grid with date badges/tags/location, Registration support |
| **Discipulados** | `/discipulados` | Page banner, Quarterly theme banner, Course cards with enrollment/capacity/progress, Registration modal |
| **Media** | `/media` | Featured content section, Filter bar (All/Videos/Audios/Documents), Content grid |
| **Video Detail** | `/media/video/:slug` | YouTube embed player, Related videos sidebar |
| **Audio Detail** | `/media/audio/:slug` | Spotify embed player, Episode listing |
| **Document Detail** | `/media/documento/:slug` | PDF viewer (react-pdf, lazy-loaded), Related documents sidebar |
| **Not Found** | `*` (catch-all) | Generic 404 page for unmatched routes |

### 3.2 Admin Pages

| Page | Route | Features |
|------|-------|----------|
| **Login** | `/admin/login` | Email/password auth via Firebase |
| **Dashboard** | `/admin` | Overview with content counts |
| **Events Admin** | `/admin/events` | CRUD table for events, image upload |
| **Courses Admin** | `/admin/courses` | CRUD for courses + course topics |
| **Media Admin** | `/admin/media` | CRUD with file upload for PDFs |
| **Registrations** | `/admin/registrations` | Read-only table, CSV export |
| **Site Config** | `/admin/settings` | Edit hero, social links, WhatsApp, calendar URL |

### 3.3 Cross-cutting Features

- **Registration Modal**: Name + WhatsApp + Email form, saves to Firestore, triggers confirmation email (Resend)
- **Google Calendar Integration**: Cloud Function proxy fetches iCal feed, parses to JSON, caches 30 min
- **WhatsApp Integration**: Simple `wa.me` links with pre-filled messages (no API)
- **Email Notifications**: Resend via Cloud Function on registration create
- **Empty States**: Every feature displays a meaningful empty state when no data exists
- **404 on Detail Pages**: Media detail pages show "content not found" when slug doesn't match
- **MSW (Mock Service Worker)**: Used for development and testing to mock Firebase data

## 4. Data Models

### Event
```
title, slug, description, date (Timestamp), endDate?, location,
imageUrl (string), tags[], featured (bool), requiresRegistration (bool),
whatsappMessage?, googleCalendarEventId?
```

### Course
```
title, slug, description, imageUrl, tags[],
status (DRAFT|COMING_SOON|ACTIVE|COMPLETED|ARCHIVED),
startDate?, endDate?, schedule?, location?, whatsappMessage?,
lineNumber?, accentColor?, capacity?, enrolled?
```

### CourseTopic (Quarterly Theme)
```
title, description, tag, startDate (Timestamp), endDate (Timestamp),
courseIds[] (references to courses)
```

### MediaContent
```
title, slug, description, type (VIDEO|AUDIO|DOCUMENT),
thumbnailUrl?, externalUrl?, fileUrl?, tags[],
featured (bool), platform?
```

### Registration
```
fullName, whatsApp, email, eventId?, courseId?, createdAt (Timestamp)
```

### SiteConfig (single document at `settings/config`)
```
heroTitle, heroSubtitle, heroImageUrl?, whatsappNumber,
instagramUrl, youtubeUrl, contactEmail, googleCalendarUrl
```

## 5. Non-Functional Requirements

- **Performance**: Lazy-load admin routes + react-pdf. Code-split detail pages.
- **SEO**: Per-page meta tags (title, description, og:image)
- **Responsive**: 390px (mobile), 768px (tablet), 1440px (desktop)
- **Accessibility**: shadcn/ui Radix primitives provide keyboard/screen-reader support
- **Deployment**: Vercel (frontend), Firebase (Firestore, Storage, Cloud Functions)
- **Testing**: MSW for mocking, Vitest + React Testing Library for unit/component tests
