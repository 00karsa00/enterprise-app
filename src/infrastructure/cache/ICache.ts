/**
 * Cache layer interfaces.
 *
 * WHY: Feature modules use these hooks, never importing from @tanstack/react-query.
 * Swapping TanStack Query for SWR requires changing the implementation files only.
 */

export interface QueryWrapperOptions<TData> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
  placeholderData?: TData;
}

export interface QueryResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isSuccess: boolean;
}

export interface MutationWrapperOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onMutate?: (variables: TVariables) => void;
  invalidateKeys?: readonly unknown[][];
}

export interface MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  data: TData | undefined;
  reset: () => void;
}

export interface InfiniteQueryWrapperOptions<TData> {
  queryKey: readonly unknown[];
  queryFn: (params: { pageParam: number }) => Promise<TData>;
  initialPageParam?: number;
  getNextPageParam: (lastPage: TData, allPages: TData[]) => number | undefined;
  enabled?: boolean;
  staleTime?: number;
}

export interface InfiniteQueryResult<TData> {
  data: { pages: TData[]; pageParams: number[] } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}
