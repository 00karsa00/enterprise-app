/**
 * useAuth — primary auth hook for components.
 *
 * WHY: Components never call authService directly. They use this hook,
 * which provides reactive state and clean domain methods.
 *
 * FORBIDDEN in this file: direct axios, localStorage, jwt library imports.
 * All auth operations delegate to the infrastructure authService.
 */
import { useState, useCallback } from 'react';

import { analytics } from '@infrastructure/analytics/AnalyticsFactory';
import { authService } from '@infrastructure/auth/AuthFactory';
import { logger } from '@infrastructure/logger/LoggerFactory';

import type { LoginCredentials, AuthUser } from '@/types';

export interface UseAuthReturn {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await authService.login(credentials);
        analytics.identify(user.id, {
          email: user.email,
          role: user.roles[0],
        });
        analytics.track('login', { method: 'email' });
        logger.info('Login successful', { userId: user.id });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Login failed. Please try again.';
        setError(msg);
        logger.warn('Login failed', { error: msg });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      analytics.track('logout');
      await authService.logout();
    } catch (err) {
      logger.warn('Logout request failed', { error: err });
      // Always clear local session even if server call fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    currentUser: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
}
