/**
 * LoginForm — the login form composition component.
 *
 * Presentational only — receives callbacks, emits form data.
 * Never handles auth logic directly.
 * Uses shared form abstractions, NEVER react-hook-form directly.
 */
import { memo } from 'react';

import { AppCheckbox } from '@shared/form/AppCheckbox';
import { AppForm } from '@shared/form/AppForm';
import { AppTextField } from '@shared/form/AppTextField';
import { AppButton } from '@shared/ui/AppButton';

import { loginSchema, type LoginFormData } from '../validators';

import styles from './LoginForm.module.css';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  forgotPasswordHref?: string;
}

export const LoginForm = memo(function LoginForm({
  onSubmit,
  isLoading = false,
  errorMessage,
  forgotPasswordHref,
}: LoginFormProps) {
  return (
    <AppForm<LoginFormData>
      schema={loginSchema}
      onSubmit={onSubmit}
      defaultValues={{ rememberMe: false }}
    >
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className={styles.errorAlert}
        >
          <span aria-hidden="true">⚠</span> {errorMessage}
        </div>
      )}

      <AppTextField
        name="email"
        label="Email address"
        type="email"
        placeholder="you@company.com"
        required
        autoComplete="email"
        autoFocus
        disabled={isLoading}
      />

      <AppTextField
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="current-password"
        disabled={isLoading}
      />

      <div className={styles.row}>
        <AppCheckbox
          name="rememberMe"
          label="Stay signed in for 30 days"
          disabled={isLoading}
        />
        {forgotPasswordHref && (
          <a href={forgotPasswordHref} className={styles.forgotLink}>
            Forgot password?
          </a>
        )}
      </div>

      <AppButton
        type="submit"
        fullWidth
        size="lg"
        loading={isLoading}
      >
        Sign In
      </AppButton>
    </AppForm>
  );
});
