import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/lib/firestore';
import { mockEvents } from '@/mocks/data';

export function useEvents(filters?: { featured?: boolean }) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
    placeholderData: filters?.featured
      ? mockEvents.filter((e) => e.featured)
      : mockEvents,
  });
}

export function useFeaturedEvents() {
  return useEvents({ featured: true });
}
