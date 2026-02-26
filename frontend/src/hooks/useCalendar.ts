import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents } from '../api/calendar';

export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: getCalendarEvents,
    select: (res) => res.events,
    staleTime: 1000 * 60 * 5,
  });
}
