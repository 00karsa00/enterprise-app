/**
 * Notification interface — the abstraction for all user-facing alerts.
 *
 * WHY: Feature modules call `notify.success()`, never `toast.success()` from Sonner.
 * Switching from Sonner to React Toastify requires changing one file.
 */

export interface NotifyOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  id?: string;
}

export interface INotificationService {
  success(message: string, options?: NotifyOptions): void;
  error(message: string, options?: NotifyOptions): void;
  warning(message: string, options?: NotifyOptions): void;
  info(message: string, options?: NotifyOptions): void;
  loading(message: string, options?: NotifyOptions): string | number;
  dismiss(id?: string | number): void;
  dismissAll(): void;
  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ): Promise<T>;
}
