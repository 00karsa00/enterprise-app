/**
 * Auth Service — business logic for auth operations.
 *
 * Orchestrates: authService calls, store updates, analytics tracking.
 * Never imports axios, localStorage, or any UI library.
 *
 * PATTERN: Thin service layer that coordinates infrastructure with domain.
 */
import { analytics } from '@infrastructure/analytics/AnalyticsFactory';
import { authService } from '@infrastructure/auth/AuthFactory';
import { logger } from '@infrastructure/logger/LoggerFactory';

import type { LoginCredentials, AuthUser } from '@/types';

export class AuthDomainService {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    logger.debug('Attempting login', { email: credentials.email });

    const user = await authService.login(credentials);

    analytics.identify(user.id, {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });
    analytics.track('user_login', { method: 'email' });

    logger.info('Login successful', { userId: user.id });
    return user;
  }

  async logout(): Promise<void> {
    const user = authService.getCurrentUser();
    logger.info('Logging out', { userId: user?.id });
    analytics.track('user_logout');
    await authService.logout();
    analytics.reset();
  }

  getCurrentUser(): AuthUser | null {
    return authService.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }
}

export const authDomainService = new AuthDomainService();
