/**
 * Authentication domain types.
 * No dependency on any auth library (JWT, OAuth, Keycloak, Firebase).
 */

export type AuthProvider = 'jwt' | 'oauth' | 'keycloak' | 'firebase';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // unix timestamp
  tokenType?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  avatarUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
