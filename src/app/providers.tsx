import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthContext, useAuthState } from '@/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const authState = useAuthState();

  return (
    <AuthContext value={authState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext>
  );
}
