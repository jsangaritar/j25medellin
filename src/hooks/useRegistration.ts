import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RegistrationInput } from '@/types';

export class RegistrationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

async function submitRegistration(
  data: RegistrationInput,
): Promise<{ id: string }> {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'UNKNOWN' }));
    throw new RegistrationError(
      body.error ?? 'Registration failed',
      body.error ?? 'UNKNOWN',
    );
  }
  return res.json();
}

export function useRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['courseTopics'] });
    },
  });
}
