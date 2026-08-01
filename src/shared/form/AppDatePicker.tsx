/**
 * AppDatePicker — date input wired to React Hook Form.
 * Uses native <input type="date"> — no third-party date picker dependency.
 * To swap in a library picker: replace only this file.
 */
import { useFormContext, Controller } from 'react-hook-form';

import styles from './AppDatePicker.module.css';

export interface AppDatePickerProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function AppDatePicker({
  name,
  label,
  required,
  disabled,
  min,
  max,
  hint,
  fullWidth = true,
}: AppDatePickerProps) {
  const { control } = useFormContext();
  const id = `datepicker-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div
          className={[styles.wrapper, fullWidth ? styles.fullWidth : '']
            .filter(Boolean)
            .join(' ')}
        >
          {label && (
            <label htmlFor={id} className={styles.label}>
              {label}
              {required && (
                <span className={styles.required} aria-label="required">
                  *
                </span>
              )}
            </label>
          )}
          <input
            {...field}
            id={id}
            type="date"
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            value={field.value as string ?? ''}
            aria-invalid={!!fieldState.error}
            className={[
              styles.input,
              fieldState.error ? styles.hasError : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
          {fieldState.error && (
            <p className={styles.error} role="alert" aria-live="polite">
              {fieldState.error.message}
            </p>
          )}
          {hint && !fieldState.error && (
            <p className={styles.hint}>{hint}</p>
          )}
        </div>
      )}
    />
  );
}
