/**
 * Mutation wrapper hook — hides TanStack Query mutations from feature modules.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO IMPORT useMutation FROM @tanstack/react-query ⚠️
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MutationWrapperOptions, MutationResult } from './ICache';

export function useMutationWrapper<TData, TVariables = void>(
  options: MutationWrapperOptions<TData, TVariables>,
): MutationResult<TData, TVariables> {
  const queryClient = useQueryClient();

  const result = useMutation<TData, Error, TVariables>({
    mutationFn: options.mutationFn,
    onSuccess: async (data, variables) => {
      // Invalidate related queries after successful mutation
      if (options.invalidateKeys) {
        await Promise.all(
          options.invalidateKeys.map((key) =>
            queryClient.invalidateQueries({ queryKey: key }),
          ),
        );
      }
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      options.onError?.(error, variables);
    },
    onMutate: (variables) => {
      options.onMutate?.(variables);
    },
  });

  return {
    mutate: result.mutate,
    mutateAsync: result.mutateAsync,
    isLoading: result.isPending,
    isError: result.isError,
    isSuccess: result.isSuccess,
    error: result.error,
    data: result.data,
    reset: result.reset,
  };
}
