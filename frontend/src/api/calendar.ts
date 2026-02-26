import type { CalendarEvent } from '../types';
import { apiFetch } from './client';

interface CalendarResponse {
  events: CalendarEvent[];
}

export function getCalendarEvents() {
  return apiFetch<CalendarResponse>('/calendar-proxy');
}
