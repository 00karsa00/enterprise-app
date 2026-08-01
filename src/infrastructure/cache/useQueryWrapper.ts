/**
 * Query wrapper hook — hides TanStack Query from feature modules.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO IMPORT useQuery FROM @tanstack/react-query ⚠️
 *
 * Feature modules import from @infrastructure/cache, never from react-query.
 */
import { useQuery } from '@tanstack/react-query';

import type { QueryWrapperOptions, QueryResult } from './ICache';

/**
 * Wrapper around TanStack Query's useQuery.
 * Feature modules use this hook exclusively.
 */
export function useQueryWrapper<TData>(
  options: QueryWrapperOptions<TData>,
): QueryResult<TData> {
  const result = useQuery<TData, Error>({
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    enabled: options.enabled,
    staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 minutes default
    gcTime: options.gcTime ?? 1000 * 60 * 10, // 10 minutes
    retry: options.retry ?? 2,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    placeholderData: options.placeholderData,
  });

  return {
    data: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: () => void result.refetch(),
    isSuccess: result.isSuccess,
  };
}
