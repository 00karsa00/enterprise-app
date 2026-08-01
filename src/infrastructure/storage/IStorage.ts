/**
 * Storage interface — the abstraction boundary for all persistence.
 *
 * WHY: Feature modules never call localStorage/sessionStorage directly.
 * They call storage.get/set/remove/clear through this interface.
 * Swapping to IndexedDB or Secure Storage requires changing only the adapter.
 *
 * FORBIDDEN: localStorage, sessionStorage, IndexedDB — in feature modules.
 */
export interface IStorage {
  get<T = unknown>(key: string): T | null;
  set<T = unknown>(key: string, value: T, ttlMs?: number): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
}

export interface StorageEntry<T> {
  value: T;
  expiresAt?: number;
}
