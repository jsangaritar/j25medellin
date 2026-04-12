import { useMutation } from '@tanstack/react-query';
import type { ContactMessageInput } from '@/types';

async function submitContact(data: ContactMessageInput): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send message');
}

export function useContact() {
  return useMutation({
    mutationFn: submitContact,
  });
}
