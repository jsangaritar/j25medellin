import { useQuery } from '@tanstack/react-query';
import { getMediaBySlug, getMediaContents } from '@/lib/firestore';
import { mockMediaContents } from '@/mocks/data';
import type { MediaType } from '@/types';

export function useMedia(filters?: { type?: MediaType; featured?: boolean }) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: () => getMediaContents(filters),
    placeholderData: () => {
      let items = mockMediaContents;
      if (filters?.type) items = items.filter((m) => m.type === filters.type);
      if (filters?.featured) items = items.filter((m) => m.featured);
      return items;
    },
  });
}

export function useMediaBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['media', slug],
    queryFn: () => getMediaBySlug(slug!),
    enabled: !!slug,
    placeholderData: () =>
      mockMediaContents.find((m) => m.slug === slug) ?? null,
  });
}
