import { useQuery } from '@tanstack/react-query';
import { getSiteConfig } from '@/lib/firestore';
import { mockSiteConfig } from '@/mocks/data';
import type { SiteConfig } from '@/types';

async function fetchSiteConfig(): Promise<SiteConfig> {
  try {
    return await getSiteConfig();
  } catch {
    return mockSiteConfig;
  }
}

export function useSiteConfig() {
  return useQuery({
    queryKey: ['siteConfig'],
    queryFn: fetchSiteConfig,
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: mockSiteConfig,
  });
}
