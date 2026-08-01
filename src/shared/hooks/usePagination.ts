/**
 * usePagination — manages pagination state.
 * Resets to page 1 when filters or page size change.
 */
import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface UsePaginationReturn extends PaginationState {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export function usePagination(
  initialPage = 1,
  initialPageSize = 10,
): UsePaginationReturn {
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState({ page: 1, pageSize }); // Reset to first page
  }, []);

  const reset = useCallback(() => {
    setState({ page: initialPage, pageSize: initialPageSize });
  }, [initialPage, initialPageSize]);

  return { ...state, setPage, setPageSize, reset };
}
