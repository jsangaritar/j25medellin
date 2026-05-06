import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthContext, useAuthState } from '@/hooks/useAuth';

const MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

const storage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
  entries: () => Object.entries(localStorage) as Array<[string, string]>,
};

const persister = experimental_createQueryPersister({
  storage,
  maxAge: MAX_AGE,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: MAX_AGE,
      retry: 1,
      persister: persister.persisterFn,
    },
  },
});

export { persister, queryClient };

export function Providers({ children }: { children: ReactNode }) {
  const authState = useAuthState();

  return (
    <AuthContext value={authState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext>
  );
}
