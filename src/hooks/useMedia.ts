import { useQuery } from '@tanstack/react-query';
import { getMediaBySlug, getMediaContents } from '@/lib/firestore';
import { mockMediaContents } from '@/mocks/data';
import type { MediaType } from '@/types';

function getMockMedia(filters?: { type?: MediaType; featured?: boolean }) {
  let items = mockMediaContents;
  if (filters?.type) items = items.filter((m) => m.type === filters.type);
  if (filters?.featured) items = items.filter((m) => m.featured);
  return items;
}

export function useMedia(filters?: { type?: MediaType; featured?: boolean }) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: async () => {
      try {
        const data = await getMediaContents(filters);
        return data.length > 0 ? data : getMockMedia(filters);
      } catch {
        return getMockMedia(filters);
      }
    },
    placeholderData: getMockMedia(filters),
  });
}

export function useMediaBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['media', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const data = await getMediaBySlug(slug);
        return data ?? mockMediaContents.find((m) => m.slug === slug) ?? null;
      } catch {
        return mockMediaContents.find((m) => m.slug === slug) ?? null;
      }
    },
    enabled: !!slug,
    placeholderData: () =>
      mockMediaContents.find((m) => m.slug === slug) ?? null,
  });
}
