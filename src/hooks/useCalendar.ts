import { useQuery } from '@tanstack/react-query';
import { mockCalendarEvents } from '@/mocks/data';
import type { CalendarEvent } from '@/types';

async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const res = await fetch('/api/calendar');
    if (!res.ok) return mockCalendarEvents;
    const data = await res.json();
    return data.length > 0 ? data : mockCalendarEvents;
  } catch {
    return mockCalendarEvents;
  }
}

export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: fetchCalendarEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: mockCalendarEvents,
  });
}
