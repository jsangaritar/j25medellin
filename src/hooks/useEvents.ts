import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/lib/firestore';

export function useEvents(filters?: { featured?: boolean }) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
  });
}

export function useFeaturedEvents() {
  return useEvents({ featured: true });
}
