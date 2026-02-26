import type { Event, StrapiResponse } from '../types';
import { apiFetch } from './client';

export function getEvents(params?: { featured?: boolean; pageSize?: number }) {
  const filters: Record<string, unknown> = {};
  if (params?.featured !== undefined) {
    filters.featured = { $eq: params.featured };
  }

  return apiFetch<StrapiResponse<Event[]>>('/events', {
    query: {
      filters,
      populate: ['image'],
      sort: ['date:desc'],
      pagination: { pageSize: params?.pageSize ?? 25 },
    },
  });
}

export function getEventBySlug(slug: string) {
  return apiFetch<StrapiResponse<Event[]>>('/events', {
    query: {
      filters: { slug: { $eq: slug } },
      populate: ['image'],
    },
  });
}
