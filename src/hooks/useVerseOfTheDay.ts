import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getVerseOfTheDay } from '@/lib/firestore';

export function useVerseOfTheDay() {
  const today = format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['votd', today],
    queryFn: () => getVerseOfTheDay(today),
    staleTime: 60 * 60 * 1000,
  });
}
