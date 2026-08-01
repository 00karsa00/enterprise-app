/**
 * NotificationProvider — renders the toast container.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO RENDER THE SONNER <Toaster> COMPONENT ⚠️
 */
import type { ReactNode } from 'react';

import { env } from '@core/config/env';
import { Toaster } from 'sonner';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        duration={env.VITE_NOTIFICATION_DURATION}
        richColors
        closeButton
        toastOptions={{
          className: 'enterprise-toast',
        }}
      />
    </>
  );
}
