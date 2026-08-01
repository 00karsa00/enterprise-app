/**
 * Auth module domain types.
 *
 * These extend or re-export the global auth types and add
 * auth-module-specific UI/form shapes that don't belong in src/types/.
 *
 * RULE: No third-party library types leak into this file.
 */

export type AuthView = 'login' | 'forgot-password' | 'reset-password';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
  token: string;
}
