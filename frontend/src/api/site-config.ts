import { mockSiteConfig } from '../mocks/data';
import type { SiteConfig, StrapiResponse } from '../types';
import { apiFetch, withMockFallback } from './client';

export function getSiteConfig() {
  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<SiteConfig>>('/site-config', {
        query: {
          populate: ['heroImage'],
        },
      }),
    () => mockSiteConfig,
  );
}
