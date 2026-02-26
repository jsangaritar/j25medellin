import { useQuery } from '@tanstack/react-query';
import { getMediaContentBySlug, getMediaContents } from '../api/media';
import type { MediaType } from '../types';

export function useMedia(params?: {
  type?: MediaType;
  featured?: boolean;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['media', params],
    queryFn: () => getMediaContents(params),
    select: (res) => res.data,
  });
}

export function useMediaBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['media', 'slug', slug],
    queryFn: () => getMediaContentBySlug(slug!),
    select: (res) => res.data[0],
    enabled: !!slug,
  });
}
