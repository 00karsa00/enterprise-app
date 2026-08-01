/**
 * JWT authentication implementation.
 *
 * WHY: All JWT handling is isolated here. Token storage, refresh logic,
 * and header injection are handled in this single adapter.
 *
 * SECURITY:
 * - Access tokens stored in memory (not localStorage) to prevent XSS theft
 * - Refresh tokens stored in httpOnly cookies (server-set) — most secure
 * - Falls back to sessionStorage for refresh tokens if httpOnly is not available
 */
import { endpoints } from '@core/config/api';
import { env } from '@core/config/env';
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import { logger } from '@infrastructure/logger/LoggerFactory';
import { storage } from '@infrastructure/storage/StorageService';

import type { AuthUser, AuthTokens, LoginCredentials } from '@/types';

import type { IAuthService } from './IAuthService';

export class JwtAuthService implements IAuthService {
  // In-memory token — not accessible to XSS
  private accessToken: string | null = null;
  private currentUser: AuthUser | null = null;

  constructor() {
    // Restore user from storage on init (not the token itself)
    this.currentUser = storage.get<AuthUser>('current_user');
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await httpClient.post<{
      user: AuthUser;
      tokens: AuthTokens;
    }>(endpoints.auth.login, credentials);

    const { user, tokens } = response.data;

    this.accessToken = tokens.accessToken;
    this.currentUser = user;

    // Set auth header for subsequent requests
    httpClient.setHeader('Authorization', `Bearer ${tokens.accessToken}`);

    // Store user profile (NOT the token) in persistent storage
    storage.set('current_user', user);

    // Store refresh token reference (actual token in httpOnly cookie ideally)
    if (tokens.refreshToken && credentials.rememberMe) {
      storage.set(env.VITE_AUTH_REFRESH_TOKEN_KEY, tokens.refreshToken);
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
  }
}
