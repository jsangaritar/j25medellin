import { mockCalendarEvents } from '../mocks/data';
import type { CalendarEvent } from '../types';
import { apiFetch, withMockFallback } from './client';

interface CalendarResponse {
  events: CalendarEvent[];
}

export function getCalendarEvents() {
  return withMockFallback(
    () => apiFetch<CalendarResponse>('/calendar-proxy'),
    () => mockCalendarEvents,
  );
}
