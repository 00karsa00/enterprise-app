/**
 * sessionStorage implementation of IStorage.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO ACCESS sessionStorage ⚠️
 *
 * Use for sensitive data that should not persist across tabs or browser sessions.
 */
import { env } from '@core/config/env';

import type { IStorage, StorageEntry } from './IStorage';

export class SessionStorageAdapter implements IStorage {
  private readonly prefix: string;

  constructor(prefix: string = env.VITE_STORAGE_PREFIX) {
    this.prefix = prefix;
  }

  private makeKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T = unknown>(key: string): T | null {
    try {
      const raw = sessionStorage.getItem(this.makeKey(key));
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
      sessionStorage.setItem(this.makeKey(key), JSON.stringify(entry));
    } catch (error) {
      console.warn('[Storage] Failed to write to sessionStorage:', error);
    }
  }

  remove(key: string): void {
    sessionStorage.removeItem(this.makeKey(key));
  }

  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(this.prefix)) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        result.push(key.slice(this.prefix.length));
      }
    }
    return result;
  }
}
