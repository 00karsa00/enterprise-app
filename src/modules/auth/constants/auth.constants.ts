/**
 * Auth module constants.
 */

export const AUTH_QUERY_KEYS = {
  currentUser: ['auth', 'current-user'] as const,
} as const;

export const AUTH_STORAGE_KEYS = {
  redirectAfterLogin: 'auth_redirect_after_login',
} as const;

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
