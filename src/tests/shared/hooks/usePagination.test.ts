import { usePagination } from '@shared/hooks/usePagination';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('usePagination', () => {
  it('initialises with defaults', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('initialises with custom values', () => {
    const { result } = renderHook(() => usePagination(3, 25));
    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(25);
  });

  it('setPage changes page', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.setPage(5));
    expect(result.current.page).toBe(5);
  });

  it('setPageSize resets page to 1', () => {
    const { result } = renderHook(() => usePagination(4, 10));
    act(() => result.current.setPageSize(50));
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(50);
  });

  it('reset() returns to initial values', () => {
    const { result } = renderHook(() => usePagination(1, 10));
    act(() => result.current.setPage(7));
    act(() => result.current.reset());
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });
});
