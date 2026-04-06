import { useQuery } from '@tanstack/react-query';
import type { CalendarEvent } from '@/types';

async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const res = await fetch('/api/calendar');
  if (!res.ok) return [];
  return res.json();
}

export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: fetchCalendarEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
