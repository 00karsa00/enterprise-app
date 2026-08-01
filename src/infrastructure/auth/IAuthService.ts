/**
 * Auth Service interface.
 *
 * WHY: Feature modules call `authService.login()`, never JWT library functions.
 * Switching from JWT to Keycloak requires implementing this interface once.
 *
 * PATTERN: Port in Hexagonal Architecture.
 */
import type { AuthUser, AuthTokens, LoginCredentials } from '@/types';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthTokens>;
  isAuthenticated(): boolean;
  getCurrentUser(): AuthUser | null;
  getAccessToken(): string | null;
  hasPermission(permission: string): boolean;
  hasRole(role: string): boolean;
}
