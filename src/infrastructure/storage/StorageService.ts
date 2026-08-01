/**
 * Storage Service — the application's single storage abstraction.
 *
 * WHY: Provides one entry point for all storage operations. Feature modules
 * call `storage.get()` without knowing whether data goes to localStorage,
 * sessionStorage, or IndexedDB.
 *
 * The default export `storage` uses localStorage. For session-scoped data,
 * use `sessionStorage` export. Both implement the same IStorage interface.
 */
import type { IStorage } from './IStorage';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { SessionStorageAdapter } from './SessionStorageAdapter';

export class StorageService implements IStorage {
  constructor(private readonly adapter: IStorage) {}

  get<T = unknown>(key: string): T | null {
    return this.adapter.get<T>(key);
  }

  set<T = unknown>(key: string, value: T, ttlMs?: number): void {
    this.adapter.set<T>(key, value, ttlMs);
  }

  remove(key: string): void {
    this.adapter.remove(key);
  }

  clear(): void {
    this.adapter.clear();
  }

  has(key: string): boolean {
    return this.adapter.has(key);
  }

  keys(): string[] {
    return this.adapter.keys();
  }
}

/** Default persistent storage (localStorage) */
export const storage = new StorageService(new LocalStorageAdapter());

/** Session-scoped storage (sessionStorage) — cleared when tab closes */
export const sessionStorage_ = new StorageService(
  new SessionStorageAdapter(),
);
