import { useQuery } from '@tanstack/react-query';
import { getMediaContents } from '../api/media';
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
