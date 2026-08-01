/**
 * Notification Factory.
 *
 * Switch providers by changing VITE_NOTIFICATION_PROVIDER in .env.
 * Zero feature module changes.
 */
import { env } from '@core/config/env';

import type { INotificationService } from './INotification';
import { SonnerNotificationAdapter } from './SonnerNotificationAdapter';

export class NotificationFactory {
  static create(): INotificationService {
    switch (env.VITE_NOTIFICATION_PROVIDER) {
      case 'sonner':
      default:
        return new SonnerNotificationAdapter();
      // case 'toastify': return new ToastifyNotificationAdapter();
    }
  }
}

/** Application-wide notification service singleton */
export const notify = NotificationFactory.create();
