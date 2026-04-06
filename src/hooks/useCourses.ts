import { useQuery } from '@tanstack/react-query';
import {
  getAllCourseTopics,
  getCourses,
  getCourseTopic,
} from '@/lib/firestore';

export function useCourses(filters?: { status?: string[] }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getCourses(filters),
  });
}

export function useCourseTopic() {
  return useQuery({
    queryKey: ['courseTopic'],
    queryFn: getCourseTopic,
  });
}

export function useAllCourseTopics() {
  return useQuery({
    queryKey: ['courseTopics', 'all'],
    queryFn: getAllCourseTopics,
  });
}
