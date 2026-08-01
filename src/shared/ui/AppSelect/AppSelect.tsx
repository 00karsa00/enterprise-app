/**
 * AppSelect — standalone select component (not form-connected).
 * For form use, see AppSelectField in shared/form.
 */
import { memo, forwardRef, type SelectHTMLAttributes } from 'react';

import styles from './AppSelect.module.css';

export interface AppSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface AppSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: AppSelectOption[];
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  fullWidth?: boolean;
  selectSize?: 'sm' | 'md' | 'lg';
}

export const AppSelect = memo(
  forwardRef<HTMLSelectElement, AppSelectProps>(function AppSelect(
    {
      options,
      label,
      error,
      hint,
      placeholder,
      fullWidth = true,
      selectSize = 'md',
      id,
      className = '',
      ...props
    },
    ref,
  ) {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div
        className={[styles.wrapper, fullWidth ? styles.fullWidth : '']
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {props.required && (
              <span className={styles.required} aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={[
            styles.select,
            styles[selectSize],
            error ? styles.hasError : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className={styles.error} role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {hint && !error && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }),
);
