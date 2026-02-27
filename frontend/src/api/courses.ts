import { mockCourses, mockCourseTopic } from '../mocks/data';
import type { Course, CourseTopic, StrapiResponse } from '../types';
import { apiFetch, withMockFallback } from './client';

export function getCourses(params?: { status?: string[]; pageSize?: number }) {
  const filters: Record<string, unknown> = {};
  if (params?.status?.length) {
    filters.status = { $in: params.status };
  }

  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<Course[]>>('/courses', {
        query: {
          filters,
          populate: ['image'],
          sort: ['startDate:desc'],
          pagination: { pageSize: params?.pageSize ?? 25 },
        },
      }),
    () => {
      let data = [...mockCourses.data];
      if (params?.status?.length) {
        const statuses = params.status;
        data = data.filter((c) => statuses.includes(c.status));
      }
      data = data.slice(0, params?.pageSize ?? 25);
      return { data, meta: mockCourses.meta };
    },
  );
}

export function getCourseTopic() {
  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<CourseTopic>>('/course-topics', {
        query: {
          populate: ['courses', 'courses.image'],
          sort: ['startDate:desc'],
          pagination: { pageSize: 1 },
        },
      }),
    () => mockCourseTopic,
  );
}

export function getCourseBySlug(slug: string) {
  return withMockFallback(
    () =>
      apiFetch<StrapiResponse<Course[]>>('/courses', {
        query: {
          filters: { slug: { $eq: slug } },
          populate: ['image'],
        },
      }),
    () => {
      const data = mockCourses.data.filter((c) => c.slug === slug);
      return { data, meta: mockCourses.meta };
    },
  );
}
