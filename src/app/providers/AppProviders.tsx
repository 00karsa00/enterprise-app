/**
 * AppProviders — composes all providers in the correct order.
 *
 * WHY: App.tsx should contain almost no setup logic.
 * All provider composition happens here, in a single place.
 *
 * ORDER MATTERS:
 * 1. ErrorBoundary — outermost, catches everything
 * 2. RouterProvider — must wrap everything that uses routing
 * 3. QueryProvider — must wrap everything that uses queries
 * 4. NotificationProvider — renders toast container
 */
import type { ReactNode } from 'react';

import { ErrorBoundary } from '@shared/errors/ErrorBoundary';

import { NotificationProvider } from './NotificationProvider';
import { QueryProvider } from './QueryProvider';
import { RouterProvider } from './RouterProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <QueryProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </QueryProvider>
      </RouterProvider>
    </ErrorBoundary>
  );
}
