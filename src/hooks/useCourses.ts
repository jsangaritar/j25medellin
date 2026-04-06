import { useQuery } from '@tanstack/react-query';
import { getCourses, getCourseTopic } from '@/lib/firestore';
import { mockCourses, mockCourseTopic } from '@/mocks/data';

export function useCourses(filters?: { status?: string[] }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      try {
        const data = await getCourses(filters);
        return data.length > 0 ? data : mockCourses;
      } catch {
        return mockCourses;
      }
    },
    placeholderData: mockCourses,
  });
}

export function useCourseTopic() {
  return useQuery({
    queryKey: ['courseTopic'],
    queryFn: async () => {
      try {
        const data = await getCourseTopic();
        return data ?? mockCourseTopic;
      } catch {
        return mockCourseTopic;
      }
    },
    placeholderData: mockCourseTopic,
  });
}
