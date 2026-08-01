import {
  isTokenExpired,
  getTokenTTLMs,
  getSafeRedirectPath,
} from '@modules/auth/utils';
import { describe, it, expect } from 'vitest';

// Helper — create a minimal JWT-shaped string
function makeToken(expOffsetSec: number): string {
  const exp = Math.floor(Date.now() / 1000) + expOffsetSec;
  const payload = btoa(JSON.stringify({ exp }));
  return `header.${payload}.signature`;
}

describe('isTokenExpired', () => {
  it('returns false for a future token', () => {
    expect(isTokenExpired(makeToken(3600))).toBe(false);
  });

  it('returns true for a past token', () => {
    expect(isTokenExpired(makeToken(-60))).toBe(true);
  });

  it('returns true for a malformed token', () => {
    expect(isTokenExpired('not.a.token')).toBe(true);
  });
});

describe('getTokenTTLMs', () => {
  it('returns positive ms for a future token', () => {
    const ttl = getTokenTTLMs(makeToken(3600));
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(3600 * 1000);
  });

  it('returns 0 for an expired token', () => {
    expect(getTokenTTLMs(makeToken(-60))).toBe(0);
  });
});

describe('getSafeRedirectPath', () => {
  it('allows relative paths', () => {
    expect(getSafeRedirectPath('/employees')).toBe('/employees');
  });

  it('allows root path', () => {
    expect(getSafeRedirectPath('/')).toBe('/');
  });

  it('rejects external URLs', () => {
    expect(getSafeRedirectPath('https://evil.com')).toBe('/dashboard');
  });

  it('rejects protocol-relative URLs', () => {
    expect(getSafeRedirectPath('//evil.com')).toBe('/dashboard');
  });

  it('returns fallback for null', () => {
    expect(getSafeRedirectPath(null)).toBe('/dashboard');
  });

  it('uses custom fallback', () => {
    expect(getSafeRedirectPath(null, '/home')).toBe('/home');
  });
});
