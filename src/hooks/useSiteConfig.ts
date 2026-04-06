import { useQuery } from '@tanstack/react-query';
import { getSiteConfig } from '@/lib/firestore';
import { mockSiteConfig } from '@/mocks/data';

export function useSiteConfig() {
  return useQuery({
    queryKey: ['siteConfig'],
    queryFn: getSiteConfig,
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: mockSiteConfig,
  });
}
