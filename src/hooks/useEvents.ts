import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/lib/firestore';
import { mockEvents } from '@/mocks/data';
import type { Event } from '@/types';

export function useEvents(filters?: { featured?: boolean }) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async (): Promise<Event[]> => {
      try {
        const data = await getEvents(filters);
        return data.length > 0 ? data : getMockEvents(filters);
      } catch {
        return getMockEvents(filters);
      }
    },
    placeholderData: getMockEvents(filters),
  });
}

function getMockEvents(filters?: { featured?: boolean }) {
  if (filters?.featured) return mockEvents.filter((e) => e.featured);
  return mockEvents;
}

export function useFeaturedEvents() {
  return useEvents({ featured: true });
}
