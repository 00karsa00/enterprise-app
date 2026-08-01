/**
 * Prefetch query wrapper.
 *
 * Use to eagerly load data before navigation (e.g., on hover over a link).
 */
import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

export interface PrefetchOptions<TData> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  staleTime?: number;
}

export function usePrefetchQuery<TData>() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (options: PrefetchOptions<TData>) => {
      void queryClient.prefetchQuery({
        queryKey: options.queryKey,
        queryFn: options.queryFn,
        staleTime: options.staleTime ?? 1000 * 60 * 5,
      });
    },
    [queryClient],
  );

  return { prefetch };
}
