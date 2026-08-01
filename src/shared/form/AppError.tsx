/**
 * AppError — standalone form error message component.
 * Use for displaying form-level errors that are not tied to a specific field.
 */
import { memo } from 'react';

import styles from './AppError.module.css';

export interface AppErrorProps {
  message: string | null | undefined;
  id?: string;
}

export const AppError = memo(function AppError({ message, id }: AppErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      className={styles.error}
      role="alert"
      aria-live="assertive"
    >
      <span aria-hidden="true" className={styles.icon}>⚠</span>
      {message}
    </p>
  );
});
