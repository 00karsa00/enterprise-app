/**
 * useCurrentUser — reads the current user from the cache layer.
 *
 * Uses useQueryWrapper (never react-query directly) to provide
 * reactive current-user state with SWR-like behaviour.
 */
import { endpoints } from '@core/config/api';
import { authService } from '@infrastructure/auth/AuthFactory';
import { useQueryWrapper } from '@infrastructure/cache/useQueryWrapper';
import { httpClient } from '@infrastructure/http/HttpClientFactory';

import type { AuthUser } from '@/types';

import { AUTH_QUERY_KEYS } from '../constants';

export function useCurrentUser() {
  return useQueryWrapper<AuthUser>({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: async () => {
      const response = await httpClient.get<AuthUser>(endpoints.auth.me);
      return response.data;
    },
    enabled: authService.isAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
