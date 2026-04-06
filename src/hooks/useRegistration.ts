import { useMutation } from '@tanstack/react-query';
import { createRegistration } from '@/lib/firestore';
import type { RegistrationInput } from '@/types';

export function useRegistration() {
  return useMutation({
    mutationFn: (data: RegistrationInput) => createRegistration(data),
  });
}
