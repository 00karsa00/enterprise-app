/**
 * AppForm — form container that integrates React Hook Form.
 *
 * ⚠️ ONLY SHARED FORM COMPONENTS MAY IMPORT react-hook-form ⚠️
 * Feature modules use these components, never RHF directly.
 *
 * PATTERN: Compound form pattern with FormProvider context.
 */
import type { ReactNode } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  FormProvider,
  type UseFormProps,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import type { ZodType } from 'zod';


import styles from './AppForm.module.css';

export interface AppFormProps<TFormData extends FieldValues> {
  schema?: ZodType<TFormData>;
  defaultValues?: UseFormProps<TFormData>['defaultValues'];
  onSubmit: SubmitHandler<TFormData>;
  children: ReactNode;
  id?: string;
  className?: string;
  noValidate?: boolean;
}

export function AppForm<TFormData extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  id,
  className = '',
  noValidate = true,
}: AppFormProps<TFormData>) {
  const methods = useForm<TFormData>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate={noValidate}
        className={[styles.form, className].filter(Boolean).join(' ')}
      >
        {children}
      </form>
    </FormProvider>
  );
}
