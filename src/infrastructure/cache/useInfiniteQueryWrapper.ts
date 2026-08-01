/**
 * Infinite query wrapper hook.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO IMPORT useInfiniteQuery FROM @tanstack/react-query ⚠️
 */
import { useInfiniteQuery } from '@tanstack/react-query';

import type { InfiniteQueryWrapperOptions, InfiniteQueryResult } from './ICache';

export function useInfiniteQueryWrapper<TData>(
  options: InfiniteQueryWrapperOptions<TData>,
): InfiniteQueryResult<TData> {
  const result = useInfiniteQuery<TData, Error>({
    queryKey: options.queryKey,
    queryFn: ({ pageParam }) =>
      options.queryFn({ pageParam: pageParam as number }),
    initialPageParam: options.initialPageParam ?? 1,
    getNextPageParam: options.getNextPageParam,
    enabled: options.enabled,
    staleTime: options.staleTime ?? 1000 * 60 * 5,
  });

  return {
    data: result.data as
      | { pages: TData[]; pageParams: number[] }
      | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    fetchNextPage: () => void result.fetchNextPage(),
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
}
