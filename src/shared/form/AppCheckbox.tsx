import { useFormContext, Controller } from 'react-hook-form';

import styles from './AppCheckbox.module.css';

export interface AppCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
  hint?: string;
}

export function AppCheckbox({ name, label, disabled, hint }: AppCheckboxProps) {
  const { control } = useFormContext();
  const id = `checkbox-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={styles.wrapper}>
          <div className={styles.row}>
            <input
              type="checkbox"
              id={id}
              checked={!!field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
              aria-invalid={!!fieldState.error}
              className={styles.checkbox}
            />
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
          </div>
          {hint && <p className={styles.hint}>{hint}</p>}
          {fieldState.error && (
            <p className={styles.error} role="alert">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
