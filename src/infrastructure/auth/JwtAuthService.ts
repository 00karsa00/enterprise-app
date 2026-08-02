/**
 * JWT authentication implementation.
 *
 * WHY: All JWT handling is isolated here. Token storage, refresh logic,
 * and header injection are handled in this single adapter.
 *
 * SECURITY:
 * - Access tokens stored in sessionStorage (cleared on tab close, not accessible cross-origin)
 * - Refresh tokens stored in httpOnly cookies (server-set) — most secure
 * - Falls back to sessionStorage for refresh tokens if httpOnly is not available
 */
import { endpoints } from '@core/config/api';
import { env } from '@core/config/env';
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import { logger } from '@infrastructure/logger/LoggerFactory';
import { storage, sessionStorage_ } from '@infrastructure/storage/StorageService';

import type {
  AuthUser,
  AuthTokens,
  LoginCredentials,
  ApiEnvelope,
  LoginResponseData,
} from '@/types';

import type { IAuthService } from './IAuthService';

const ACCESS_TOKEN_KEY = 'access_token';
const TOKEN_TYPE_KEY = 'token_type';

export class JwtAuthService implements IAuthService {
  // In-memory mirror — avoids repeated sessionStorage reads
  private accessToken: string | null = null;
  private currentUser: AuthUser | null = null;

  constructor() {
    // Restore session on page reload
    this.currentUser = storage.get<AuthUser>('current_user');
    const savedToken = sessionStorage_.get<string>(ACCESS_TOKEN_KEY);
    const savedTokenType = sessionStorage_.get<string>(TOKEN_TYPE_KEY) ?? 'Bearer';

    if (savedToken && this.currentUser) {
      this.accessToken = savedToken;
      // Re-attach the auth header so API calls work immediately after reload
      httpClient.setHeader('Authorization', `${savedTokenType} ${savedToken}`);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Backend wraps every response in { success, data, meta }
    const response = await httpClient.post<ApiEnvelope<LoginResponseData>>(
      endpoints.auth.login,
      credentials,
    );

    const { accessToken, expiresIn, tokenType, admin } = response.data.data;

    // Map backend AdminLoginData → domain AuthUser
    // role (singular string) → roles (string array)
    // id (number)            → id (string)
    const user: AuthUser = {
      id: String(admin.id),
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      roles: [admin.role],
      permissions: roleToPermissions(admin.role),
      metadata: {
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt,
      },
    };

    const tokens: AuthTokens = {
      accessToken,
      tokenType,
      // Convert expiresIn (seconds TTL) → expiresAt (absolute unix ms timestamp)
      expiresAt: Date.now() + expiresIn * 1000,
    };

    this.accessToken = accessToken;
    this.currentUser = user;

    // Set auth header for subsequent requests
    httpClient.setHeader('Authorization', `${tokenType} ${accessToken}`);

    // Store user profile in persistent storage (survives refresh)
    storage.set('current_user', user);

    // Store token in sessionStorage (cleared when tab closes)
    sessionStorage_.set(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage_.set(TOKEN_TYPE_KEY, tokenType);

    // rememberMe: store expiresAt so we can check on next page load
    if (credentials.rememberMe) {
      storage.set(env.VITE_AUTH_TOKEN_KEY, tokens.expiresAt);
    }
    logger.info('User authenticated', { userId: user.id, email: user.email });

    return user;
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(endpoints.auth.logout);
    } catch {
      // Logout should always succeed client-side even if server call fails
    } finally {
      this.clearSession();
      logger.info('User logged out');
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = storage.get<string>(env.VITE_AUTH_REFRESH_TOKEN_KEY);

    const response = await httpClient.post<{ tokens: AuthTokens }>(
      endpoints.auth.refresh,
      { refreshToken },
    );

    const { tokens } = response.data;
    this.accessToken = tokens.accessToken;
    httpClient.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
    sessionStorage_.set(ACCESS_TOKEN_KEY, tokens.accessToken);
    sessionStorage_.set(TOKEN_TYPE_KEY, 'Bearer');

    return tokens;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null && this.currentUser !== null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) ?? false;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.roles.includes(role) ?? false;
  }

  private clearSession(): void {
    this.accessToken = null;
    this.currentUser = null;
    httpClient.removeHeader('Authorization');
    storage.remove('current_user');
    storage.remove(env.VITE_AUTH_REFRESH_TOKEN_KEY);
    storage.remove(env.VITE_AUTH_TOKEN_KEY);
    sessionStorage_.remove(ACCESS_TOKEN_KEY);
    sessionStorage_.remove(TOKEN_TYPE_KEY);
  }
}

// ─── Role → permissions mapping ──────────────────────────────────────────────
// Derive a default permission set from the admin role.
// Extend this as your backend adds explicit permission support.
const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    'admin:manage',
    'employee:read', 'employee:create', 'employee:update', 'employee:delete',
    'leave:read',    'leave:create',    'leave:update',    'leave:delete',
    'report:read',   'report:export',
  ],
  admin: [
    'employee:read', 'employee:create', 'employee:update', 'employee:delete',
    'leave:read',    'leave:create',    'leave:update',    'leave:delete',
    'report:read',   'report:export',
  ],
  hr_manager: [
    'employee:read',
    'leave:read', 'leave:create', 'leave:update',
    'report:read',
  ],
};

function roleToPermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
