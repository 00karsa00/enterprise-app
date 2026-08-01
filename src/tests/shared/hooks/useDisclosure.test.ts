import { useDisclosure } from '@shared/hooks/useDisclosure';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('useDisclosure', () => {
  it('starts closed by default', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('starts open when initialState=true', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('open() sets isOpen to true', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('close() sets isOpen to false', () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('toggle() flips state', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });
});
