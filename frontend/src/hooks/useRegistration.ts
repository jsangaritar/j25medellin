import { useMutation } from '@tanstack/react-query';
import { createRegistration } from '../api/registrations';

export function useRegistration() {
  return useMutation({
    mutationFn: createRegistration,
  });
}
