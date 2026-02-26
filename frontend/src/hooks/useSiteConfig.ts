import { useQuery } from '@tanstack/react-query';
import { getSiteConfig } from '../api/site-config';

export function useSiteConfig() {
  return useQuery({
    queryKey: ['site-config'],
    queryFn: getSiteConfig,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 30,
  });
}
