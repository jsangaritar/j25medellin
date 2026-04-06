import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Returns a map of courseId → enrollment count
 * based on actual registrations in Firestore.
 */
export function useEnrollments(courseIds: string[]) {
  return useQuery({
    queryKey: ['enrollments', courseIds],
    queryFn: async () => {
      if (courseIds.length === 0) return new Map<string, number>();

      const q = query(
        collection(db, 'registrations'),
        where('courseId', 'in', courseIds),
      );
      const snapshot = await getDocs(q);

      const counts = new Map<string, number>();
      for (const doc of snapshot.docs) {
        const cid = doc.data().courseId as string;
        counts.set(cid, (counts.get(cid) ?? 0) + 1);
      }
      return counts;
    },
    enabled: courseIds.length > 0,
  });
}
