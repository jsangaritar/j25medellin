# Plan: Unified Event System with Google Calendar Sync

## Context

The app currently has two disconnected event systems: Google Calendar events (displayed on home page calendar, fetched live via iCal) and Firestore events (managed via admin, displayed on `/eventos` page). This creates a confusing split where the calendar shows different data than the events page.

**Goal:** Make the Firestore DB the single source of truth. Google Calendar syncs INTO the DB periodically. Add an `eventType` field (`j+` / `church`) to differentiate events visually in the calendar. All UI reads from DB only.

---

## Step 1: Type System Updates

**File:** `src/types/index.ts`

- Add `EventType = 'j+' | 'church'` and labels map
- Add `eventType: EventType` to `Event` interface (already has `googleCalendarEventId?: string`)

---

## Step 2: Calendar Utils -> Use `Event[]`

**File:** `src/utils/calendar.ts`

- `CalendarDay.events`: change from `CalendarEvent[]` to `Event[]`
- `buildCalendarGrid(month, events: Event[])`: filter on `event.date` instead of `event.start`
- Import `Event` from `@/types` instead of `CalendarEvent`

---

## Step 3: Calendar Components Refactor

### `MonthlyCalendar.tsx`

- Props: `events: CalendarEvent[]` to `events: Event[]`

### `CalendarCell.tsx`

- Use `Event` type throughout
- **Dot colors by type:** J+ -> `bg-accent-bright` (green), Church -> `bg-text-muted` (gray)
- **HoverCard differentiation:**
  - J+ events: green accent bar, image thumbnail (if `imageUrl` exists), title, time, location
  - Church events: muted gray accent bar, title + time + location only, no image
- Update field references: `event.start` to `event.date`, `event.end` to `event.endDate`, `event.description` (for location) to `event.location`

### `UpcomingHighlights.tsx`

- Props: `events: CalendarEvent[]` to `events: Event[]`
- **Remove Clock and MapPin icons** from event cards (user request)
- Update field references: `event.start` to `event.date`
- Add subtle type indicator (colored left border or small type label)

---

## Step 4: Home Page Data Source Switch

**File:** `src/pages/HomePage.tsx`

- Replace `useCalendar()` with `useEvents()` -- both return arrays, just different types
- Calendar and UpcomingHighlights now render from Firestore events

---

## Step 5: Sync Endpoint

**New file:** `api/sync-calendar.ts`

Vercel serverless function that:

1. **Auth:** GET -> verify `CRON_SECRET` header. POST -> verify Firebase ID token via `admin.auth().verifyIdToken()`
2. **Fetch iCal** from `GOOGLE_CALENDAR_URL` using `node-ical` (reuse existing pattern from `api/calendar.ts`)
3. **Query existing synced events** from Firestore where `googleCalendarEventId` is set -> build a lookup map
4. **For each iCal VEVENT:**
   - Match by `event.uid` to `googleCalendarEventId`
   - **Not found:** Create new event doc with `eventType: 'j+'`, auto-slug, defaults (featured=false, requiresRegistration=false, tags=[], location from iCal or 'Casa Sobre la Roca - Medellín')
   - **Found:** Update ONLY `date` and `endDate` -- nothing else. Title, description, location, imageUrl, tags, featured, requiresRegistration, eventType, and all other fields are left untouched (admin-curated fields preserved)
5. **No auto-delete** -- events removed from Google Cal stay in DB (admin deletes manually)
6. Return `{ created, updated, total }`

Reuses Firebase Admin init pattern from `api/register.ts`.

---

## Step 6: Vercel Cron Config

**File:** `vercel.json`

```json
"crons": [{
  "path": "/api/sync-calendar",
  "schedule": "0 */12 * * *"
}]
```

> **Note:** Vercel Hobby plan limits crons to once/day. If on Hobby, change to `"0 0 * * *"`. Pro plan supports every 12 hours.

Add `CRON_SECRET` env var in Vercel dashboard.

---

## Step 7: Admin Panel Updates

**File:** `src/pages/admin/EventsAdminPage.tsx`

1. **"Sincronizar" button** in header: calls `POST /api/sync-calendar` with Firebase auth token, shows loading state, invalidates events query on success, displays result count
2. **Event type selector** in form: `<Select>` with "J+" / "Iglesia" options, defaults to `'church'` for new manual events
3. **Type column** in events table: colored badge (green for J+, muted for Iglesia)
4. **Synced indicator:** small icon/badge on rows with `googleCalendarEventId` set

---

## Step 8: Cleanup

- Delete `src/hooks/useCalendar.ts` (unused -- home page now uses `useEvents`)
- Remove `getCachedCalendarEvents()` from `src/lib/firestore.ts` (unused cache function)
- Keep `api/calendar.ts` for now (can be deleted later, not hurting anything)
- Remove `CalendarEvent` from types if nothing references it after cleanup (sync endpoint defines its own internal type)

---

## Step 9: Defensive Defaults for Migration

In components/hooks, default `eventType` for existing docs missing the field:

```typescript
event.eventType ?? "j+";
```

This handles the transition without needing a data migration script.

---

## Files Summary

| File                                                      | Action                                       |
| --------------------------------------------------------- | -------------------------------------------- |
| `src/types/index.ts`                                      | Add EventType, update Event                  |
| `src/utils/calendar.ts`                                   | Refactor to use Event[]                      |
| `src/components/features/calendar/CalendarCell.tsx`       | Type-differentiated dots + hover cards       |
| `src/components/features/calendar/MonthlyCalendar.tsx`    | Accept Event[]                               |
| `src/components/features/calendar/UpcomingHighlights.tsx` | Accept Event[], remove icons, type indicator |
| `src/pages/HomePage.tsx`                                  | Switch to useEvents()                        |
| `api/sync-calendar.ts`                                    | **New** -- sync endpoint                     |
| `vercel.json`                                             | Add cron config                              |
| `src/pages/admin/EventsAdminPage.tsx`                     | Sync button, type selector, type column      |
| `src/hooks/useCalendar.ts`                                | **Delete**                                   |
| `src/lib/firestore.ts`                                    | Remove getCachedCalendarEvents               |

---

## Verification

1. **Build:** `pnpm build` passes
2. **Lint:** `pnpm check` passes
3. **Manual test flow:**
   - Create a church event in admin -> appears in calendar with muted dots
   - Trigger sync from admin -> Google Cal events appear in DB as J+ type with green dots
   - Hover over calendar cells -> J+ events show image preview, church events show simple card
   - UpcomingHighlights shows events from DB without icons
   - Events page shows all events with type badges
4. **Cron:** After deploy, verify cron runs via Vercel dashboard logs
