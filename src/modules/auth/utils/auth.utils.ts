/**
 * Auth module utilities — pure functions, no side effects.
 */

/**
 * Checks whether a JWT token string is expired based on its exp claim.
 * This is a CLIENT-SIDE hint only — server validation is always authoritative.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    const payload = JSON.parse(atob(payloadBase64)) as { exp?: number };
    if (typeof payload.exp !== 'number') return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Extracts the time until expiry from a JWT token, in milliseconds.
 * Returns 0 if the token is already expired or invalid.
 */
export function getTokenTTLMs(token: string): number {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return 0;
    const payload = JSON.parse(atob(payloadBase64)) as { exp?: number };
    if (typeof payload.exp !== 'number') return 0;
    return Math.max(0, payload.exp * 1000 - Date.now());
  } catch {
    return 0;
  }
}

/**
 * Returns a sanitised redirect URL — only allows same-origin paths.
 * Prevents open redirect vulnerabilities.
 */
export function getSafeRedirectPath(
  raw: string | null | undefined,
  fallback = '/dashboard',
): string {
  if (!raw) return fallback;
  // Only allow relative paths (starting with /) — reject external URLs
  if (/^\/[^/\\]/.test(raw) || raw === '/') return raw;
  return fallback;
}
