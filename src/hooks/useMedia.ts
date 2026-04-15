import { useQuery } from '@tanstack/react-query';
import { getMediaBySlug, getMediaContents } from '@/lib/firestore';
import type { MediaType } from '@/types';

export function useMedia(filters?: { type?: MediaType; featured?: boolean }) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: () => getMediaContents(filters),
  });
}

export function useMediaBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['media', slug],
    queryFn: () => getMediaBySlug(slug as string),
    enabled: !!slug,
  });
}
