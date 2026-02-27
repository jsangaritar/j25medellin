import { useQuery } from '@tanstack/react-query';
import { getCourses, getCourseTopic } from '../api/courses';

export function useCourses(params?: { status?: string[]; pageSize?: number }) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => getCourses(params),
    select: (res) => res.data,
  });
}

export function useActiveCourses() {
  return useCourses({
    status: ['COMING_SOON', 'ACTIVE'],
    pageSize: 6,
  });
}

export function useCourseTopic() {
  return useQuery({
    queryKey: ['course-topic'],
    queryFn: getCourseTopic,
    select: (res) => res.data,
  });
}
