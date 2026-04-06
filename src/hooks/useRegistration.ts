import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RegistrationInput } from '@/types';

async function submitRegistration(
  data: RegistrationInput,
): Promise<{ id: string }> {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export function useRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}
