import { useQuery } from '@tanstack/react-query';
import { getCachedCalendarEvents } from '@/lib/firestore';
import { mockCalendarEvents } from '@/mocks/data';

export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: getCachedCalendarEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: mockCalendarEvents,
  });
}
