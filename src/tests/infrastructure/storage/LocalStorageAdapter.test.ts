import { LocalStorageAdapter } from '@infrastructure/storage/LocalStorageAdapter';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter('test_');
  });

  it('stores and retrieves a value', () => {
    adapter.set('key', { name: 'test' });
    expect(adapter.get('key')).toEqual({ name: 'test' });
  });

  it('returns null for missing key', () => {
    expect(adapter.get('nonexistent')).toBeNull();
  });

  it('removes a value', () => {
    adapter.set('key', 'value');
    adapter.remove('key');
    expect(adapter.get('key')).toBeNull();
  });

  it('respects namespace prefix', () => {
    adapter.set('key', 'value');
    expect(localStorage.getItem('test_key')).not.toBeNull();
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('has() returns correct boolean', () => {
    adapter.set('exists', true);
    expect(adapter.has('exists')).toBe(true);
    expect(adapter.has('missing')).toBe(false);
  });

  it('expires values with TTL', async () => {
    adapter.set('expiring', 'value', 1); // 1ms TTL
    await new Promise((r) => setTimeout(r, 10));
    expect(adapter.get('expiring')).toBeNull();
  });

  it('clear() removes all namespaced keys', () => {
    adapter.set('a', 1);
    adapter.set('b', 2);
    localStorage.setItem('other_key', 'should-remain');
    adapter.clear();
    expect(adapter.has('a')).toBe(false);
    expect(adapter.has('b')).toBe(false);
    expect(localStorage.getItem('other_key')).toBe('should-remain');
  });
});
