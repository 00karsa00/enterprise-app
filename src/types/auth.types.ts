/**
 * Authentication domain types.
 * No dependency on any auth library (JWT, OAuth, Keycloak, Firebase).
 */

export type AuthProvider = 'jwt' | 'oauth' | 'keycloak' | 'firebase';

export type AdminRole = 'super_admin' | 'admin' | 'hr_manager';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // unix timestamp (ms)
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

// ─── Real API response shape from backend ────────────────────────────────────

/** Shape of the admin object inside the login response */
export interface AdminLoginData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
}

/** The `data` payload inside the wrapped login response */
export interface LoginResponseData {
  accessToken: string;
  expiresIn: number; // seconds
  tokenType: string;
  admin: AdminLoginData;
}

/** Full response envelope returned by the backend for every API call */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}
