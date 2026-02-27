import { mockEvents } from '../mocks/data';
import type { Event, StrapiResponse } from '../types';
import { apiFetch, withMockFallback } from './client';

export function getEvents(params?: { featured?: boolean; pageSize?: number }) {
  const filters: Record<string, unknown> = {};
  if (params?.featured !== undefined) {
    filters.featured = { $eq: params.featured };
  }

  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<Event[]>>('/events', {
        query: {
          filters,
          populate: ['image'],
          sort: ['date:desc'],
          pagination: { pageSize: params?.pageSize ?? 25 },
        },
      }),
    () => {
      let data = [...mockEvents.data];
      if (params?.featured !== undefined) {
        data = data.filter((e) => e.featured === params.featured);
      }
      data = data.slice(0, params?.pageSize ?? 25);
      return { data, meta: mockEvents.meta };
    },
  );
}

export function getEventBySlug(slug: string) {
  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<Event[]>>('/events', {
        query: {
          filters: { slug: { $eq: slug } },
          populate: ['image'],
        },
      }),
    () => {
      const data = mockEvents.data.filter((e) => e.slug === slug);
      return { data, meta: mockEvents.meta };
    },
  );
}
