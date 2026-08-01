export type {
  QueryWrapperOptions,
  QueryResult,
  MutationWrapperOptions,
  MutationResult,
  InfiniteQueryWrapperOptions,
  InfiniteQueryResult,
} from './ICache';
export { useQueryWrapper } from './useQueryWrapper';
export { useMutationWrapper } from './useMutationWrapper';
export { useInfiniteQueryWrapper } from './useInfiniteQueryWrapper';
export { usePrefetchQuery } from './usePrefetchQuery';
export { queryClient } from './QueryClientConfig';
