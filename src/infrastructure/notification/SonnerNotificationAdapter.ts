/**
 * Sonner implementation of INotificationService.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO IMPORT SONNER ⚠️
 *
 * To switch to React Toastify: implement INotificationService using `toast`
 * from 'react-toastify' and update NotificationFactory.
 */
import { env } from '@core/config/env';
import { toast } from 'sonner';

import type {
  INotificationService,
  NotifyOptions,
} from './INotification';

export class SonnerNotificationAdapter implements INotificationService {
  private readonly defaultDuration: number;

  constructor(duration: number = env.VITE_NOTIFICATION_DURATION) {
    this.defaultDuration = duration;
  }

  private toSonnerOptions(options?: NotifyOptions) {
    return {
      duration: options?.duration ?? this.defaultDuration,
      description: options?.description,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      onDismiss: options?.onDismiss,
      id: options?.id,
    };
  }

  success(message: string, options?: NotifyOptions): void {
    toast.success(message, this.toSonnerOptions(options));
  }

  error(message: string, options?: NotifyOptions): void {
    toast.error(message, this.toSonnerOptions(options));
  }

  warning(message: string, options?: NotifyOptions): void {
    toast.warning(message, this.toSonnerOptions(options));
  }

  info(message: string, options?: NotifyOptions): void {
    toast.info(message, this.toSonnerOptions(options));
  }

  loading(message: string, options?: NotifyOptions): string | number {
    return toast.loading(message, this.toSonnerOptions(options));
  }

  dismiss(id?: string | number): void {
    toast.dismiss(id);
  }

  dismissAll(): void {
    toast.dismiss();
  }

  async promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ): Promise<T> {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }) as Promise<T>;
  }
}
