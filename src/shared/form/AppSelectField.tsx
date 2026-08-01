/**
 * AppSelectField — select field wired to React Hook Form.
 */
import { useFormContext, Controller } from 'react-hook-form';

import styles from './AppSelectField.module.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface AppSelectFieldProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export function AppSelectField({
  name,
  label,
  options,
  placeholder = 'Select...',
  disabled,
  required,
  fullWidth = true,
}: AppSelectFieldProps) {
  const { control } = useFormContext();
  const selectId = `select-${name}`;

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
            <label htmlFor={selectId} className={styles.label}>
              {label}
              {required && (
                <span className={styles.required} aria-label="required">
                  *
                </span>
              )}
            </label>
          )}
          <select
            {...field}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={!!fieldState.error}
            className={[
              styles.select,
              fieldState.error ? styles.hasError : '',
            ]
              .filter(Boolean)
              .join(' ')}
            value={field.value as string ?? ''}
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
          {fieldState.error && (
            <p className={styles.error} role="alert" aria-live="polite">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
