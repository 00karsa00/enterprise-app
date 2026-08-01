/**
 * TanStack Query client configuration.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO IMPORT QueryClient FROM @tanstack/react-query ⚠️
 * (except the wrapper hooks)
 */
import { logger } from '@infrastructure/logger/LoggerFactory';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && 'statusCode' in error) {
          const status = (error as { statusCode: number }).statusCode;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: (error) => {
        logger.error('Mutation failed', error);
      },
    },
  },
});
