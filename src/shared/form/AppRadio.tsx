/**
 * AppRadio — radio button group wired to React Hook Form.
 */
import { useFormContext, Controller } from 'react-hook-form';

import styles from './AppRadio.module.css';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AppRadioProps {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function AppRadio({
  name,
  label,
  options,
  required,
  orientation = 'vertical',
}: AppRadioProps) {
  const { control } = useFormContext();
  const groupId = `radio-group-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <fieldset
          className={styles.fieldset}
          aria-describedby={fieldState.error ? `${groupId}-error` : undefined}
        >
          {label && (
            <legend className={styles.legend}>
              {label}
              {required && (
                <span className={styles.required} aria-label="required">
                  *
                </span>
              )}
            </legend>
          )}
          <div
            className={[
              styles.options,
              styles[orientation],
            ].join(' ')}
          >
            {options.map((opt) => {
              const id = `${groupId}-${opt.value}`;
              return (
                <label key={opt.value} htmlFor={id} className={styles.option}>
                  <input
                    type="radio"
                    id={id}
                    name={field.name}
                    value={opt.value}
                    checked={field.value === opt.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={opt.disabled}
                    className={styles.radio}
                    aria-invalid={!!fieldState.error}
                  />
                  <span className={styles.optionLabel}>{opt.label}</span>
                </label>
              );
            })}
          </div>
          {fieldState.error && (
            <p
              id={`${groupId}-error`}
              className={styles.error}
              role="alert"
              aria-live="polite"
            >
              {fieldState.error.message}
            </p>
          )}
        </fieldset>
      )}
    />
  );
}
