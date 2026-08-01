/**
 * AppInput — base input component.
 *
 * ACCESSIBILITY: Proper label association, error state with aria-invalid
 * and aria-describedby for screen readers.
 */
import {
  memo,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import styles from './AppInput.module.css';

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
}

export const AppInput = memo(
  forwardRef<HTMLInputElement, AppInputProps>(function AppInput(
    {
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      fullWidth = true,
      id,
      className = '',
      ...props
    },
    ref,
  ) {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div
        className={[styles.wrapper, fullWidth ? styles.fullWidth : '']
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && (
              <span className={styles.required} aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className={[styles.inputWrapper, error ? styles.hasError : ''].filter(Boolean).join(' ')}>
          {leftAddon && (
            <span className={styles.addon} aria-hidden="true">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              [errorId, hintId].filter(Boolean).join(' ') || undefined
            }
            className={[
              styles.input,
              leftAddon ? styles.hasLeftAddon : '',
              rightAddon ? styles.hasRightAddon : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {rightAddon && (
            <span className={styles.addonRight} aria-hidden="true">
              {rightAddon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} className={styles.error} role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    );
  }),
);
