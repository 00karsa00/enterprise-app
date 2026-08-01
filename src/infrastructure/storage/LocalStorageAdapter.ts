/**
 * localStorage implementation of IStorage.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO ACCESS localStorage ⚠️
 *
 * Features:
 * - JSON serialization/deserialization
 * - Key namespacing (prefix) to avoid collisions
 * - TTL (time-to-live) expiry support
 * - Safe error handling (storage full, private browsing)
 */
import { env } from '@core/config/env';

import type { IStorage, StorageEntry } from './IStorage';

export class LocalStorageAdapter implements IStorage {
  private readonly prefix: string;

  constructor(prefix: string = env.VITE_STORAGE_PREFIX) {
    this.prefix = prefix;
  }

  private makeKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T = unknown>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.makeKey(key));
      if (raw === null) return null;

      const entry = JSON.parse(raw) as StorageEntry<T>;

      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        this.remove(key);
        return null;
      }

      return entry.value;
    } catch {
      return null;
    }
  }

  set<T = unknown>(key: string, value: T, ttlMs?: number): void {
    try {
      const entry: StorageEntry<T> = {
        value,
        ...(ttlMs !== undefined && { expiresAt: Date.now() + ttlMs }),
      };
      localStorage.setItem(this.makeKey(key), JSON.stringify(entry));
    } catch (error) {
      // Fail silently — storage quota exceeded or private browsing
      console.warn('[Storage] Failed to write to localStorage:', error);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.makeKey(key));
  }

  clear(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        result.push(key.slice(this.prefix.length));
      }
    }
    return result;
  }
}
