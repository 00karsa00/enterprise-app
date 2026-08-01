/**
 * Auth Store — Zustand state management for auth, hidden behind a clean API.
 *
 * ⚠️ ONLY THIS FILE MAY IMPORT ZUSTAND IN THE AUTH MODULE ⚠️
 *
 * EXPOSED API: login(), logout(), setUser(), clearSession()
 * NEVER EXPOSED: create(), setState(), dispatch()
 *
 * Switching Zustand → Redux requires changing ONLY this file.
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { AuthUser, AuthTokens } from '@/types';

interface AuthStoreState {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  // Actions — domain-meaningful names only
  setUser: (user: AuthUser, tokens: AuthTokens) => void;
  clearSession: () => void;
  setInitializing: (value: boolean) => void;
}

const useAuthStoreInternal = create<AuthStoreState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isInitializing: true,

        setUser: (user: AuthUser, _tokens: AuthTokens) => {
          set(
            { user, isAuthenticated: true, isInitializing: false },
            false,
            'auth/setUser',
          );
        },

        clearSession: () => {
          set(
            { user: null, isAuthenticated: false, isInitializing: false },
            false,
            'auth/clearSession',
          );
        },

        setInitializing: (value: boolean) => {
          set({ isInitializing: value }, false, 'auth/setInitializing');
        },
      }),
      {
        name: 'auth-store',
        // Only persist the user profile — never persist tokens
        partialize: (state) => ({ user: state.user }),
      },
    ),
    { name: 'auth-store' },
  ),
);

/**
 * Public hook — only the domain API is accessible, not Zustand internals.
 */
export const useAuthStore = useAuthStoreInternal;
