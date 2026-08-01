/**
 * useLocalStorage — React state synced to localStorage via StorageService.
 * Never accesses localStorage directly — always goes through the abstraction.
 */
import { useState, useCallback } from 'react';

import { storage } from '@infrastructure/storage/StorageService';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.get<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function'
          ? (value as (prev: T) => T)(prev)
          : value;
        storage.set(key, next);
        return next;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    storage.remove(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
