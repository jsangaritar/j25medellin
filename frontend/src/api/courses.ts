import type { Course, StrapiResponse } from '../types';
import { apiFetch } from './client';

export function getCourses(params?: { status?: string[]; pageSize?: number }) {
  const filters: Record<string, unknown> = {};
  if (params?.status?.length) {
    filters.status = { $in: params.status };
  }

  return apiFetch<StrapiResponse<Course[]>>('/courses', {
    query: {
      filters,
      populate: ['image'],
      sort: ['startDate:desc'],
      pagination: { pageSize: params?.pageSize ?? 25 },
    },
  });
}

export function getCourseBySlug(slug: string) {
  return apiFetch<StrapiResponse<Course[]>>('/courses', {
    query: {
      filters: { slug: { $eq: slug } },
      populate: ['image'],
    },
  });
}
