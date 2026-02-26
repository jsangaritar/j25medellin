import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../api/events';

export function useEvents(params?: { featured?: boolean; pageSize?: number }) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => getEvents(params),
    select: (res) => res.data,
  });
}

export function useFeaturedEvents() {
  return useEvents({ featured: true, pageSize: 5 });
}
