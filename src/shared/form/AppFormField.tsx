/**
 * AppFormField — generic form field wrapper for layout/label/error.
 * Useful when building custom field compositions.
 */
import { memo, type ReactNode } from 'react';

import styles from './AppFormField.module.css';

export interface AppFormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}

export const AppFormField = memo(function AppFormField({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: AppFormFieldProps) {
  const errorId = error ? `field-error-${Math.random().toString(36).slice(2)}` : undefined;

  return (
    <div className={styles.field}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={styles.label}
        >
          {label}
          {required && (
            <span className={styles.required} aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <div aria-describedby={errorId}>{children}</div>
      {error && (
        <p id={errorId} className={styles.error} role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
});
