/**
 * QueryProvider — wraps the app with TanStack Query context.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO USE QueryClientProvider ⚠️
 * (and QueryClientConfig.ts for queryClient creation)
 */
import type { ReactNode } from 'react';

import { queryClient } from '@infrastructure/cache/QueryClientConfig';
import { QueryClientProvider } from '@tanstack/react-query';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
