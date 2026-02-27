import { mockMediaContents } from '../mocks/data';
import type { MediaContent, MediaType, StrapiResponse } from '../types';
import { apiFetch, withMockFallback } from './client';

export function getMediaContents(params?: {
  type?: MediaType;
  featured?: boolean;
  pageSize?: number;
}) {
  const filters: Record<string, unknown> = {};
  if (params?.type) {
    filters.type = { $eq: params.type };
  }
  if (params?.featured !== undefined) {
    filters.featured = { $eq: params.featured };
  }

  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<MediaContent[]>>('/media-contents', {
        query: {
          filters,
          populate: ['thumbnailImage', 'file'],
          sort: ['createdAt:desc'],
          pagination: { pageSize: params?.pageSize ?? 25 },
        },
      }),
    () => {
      let data = [...mockMediaContents.data];
      if (params?.type) {
        data = data.filter((m) => m.type === params.type);
      }
      if (params?.featured !== undefined) {
        data = data.filter((m) => m.featured === params.featured);
      }
      data = data.slice(0, params?.pageSize ?? 25);
      return { data, meta: mockMediaContents.meta };
    },
  );
}

export function getMediaContentBySlug(slug: string) {
  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<MediaContent[]>>('/media-contents', {
        query: {
          filters: { slug: { $eq: slug } },
          populate: ['thumbnailImage', 'file'],
        },
      }),
    () => {
      const data = mockMediaContents.data.filter((m) => m.slug === slug);
      return { data, meta: mockMediaContents.meta };
    },
  );
}
