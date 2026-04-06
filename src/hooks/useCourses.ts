import { useQuery } from '@tanstack/react-query';
import { getCourses, getCourseTopic } from '@/lib/firestore';
import { mockCourses, mockCourseTopic } from '@/mocks/data';

export function useCourses(filters?: { status?: string[] }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getCourses(filters),
    placeholderData: mockCourses,
  });
}

export function useCourseTopic() {
  return useQuery({
    queryKey: ['courseTopic'],
    queryFn: getCourseTopic,
    placeholderData: mockCourseTopic,
  });
}
