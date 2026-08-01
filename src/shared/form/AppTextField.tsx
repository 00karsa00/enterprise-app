/**
 * AppTextField — controlled text field wired to React Hook Form.
 *
 * ⚠️ ONLY SHARED FORM COMPONENTS MAY IMPORT react-hook-form ⚠️
 */
import { AppInput, type AppInputProps } from '@shared/ui/AppInput';
import { useFormContext, Controller, type RegisterOptions } from 'react-hook-form';

export interface AppTextFieldProps
  extends Omit<AppInputProps, 'value' | 'onChange' | 'onBlur' | 'name'> {
  name: string;
  rules?: RegisterOptions;
}

export function AppTextField({ name, rules, ...inputProps }: AppTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <AppInput
          {...inputProps}
          {...field}
          value={field.value as string ?? ''}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
