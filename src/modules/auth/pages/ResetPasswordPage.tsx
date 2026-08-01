/**
 * ResetPasswordPage — processes the token from the email link and sets a new password.
 */
import { useState } from 'react';

import { ROUTES } from '@core/config/routes';
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import { AppForm } from '@shared/form/AppForm';
import { AppTextField } from '@shared/form/AppTextField';
import { AppButton } from '@shared/ui/AppButton';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { resetPasswordSchema, type ResetPasswordFormData } from '../validators';

import styles from './AuthPage.module.css';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token') ?? '';

  async function handleSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);
    setError(null);
    try {
      await httpClient.post('/auth/reset-password', {
        token: data.token,
        password: data.password,
      });
      void navigate(ROUTES.LOGIN, {
        state: { message: 'Password reset successfully. Please sign in.' },
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Reset failed. The link may have expired.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Invalid link</h1>
          <p className={styles.message}>
            This password reset link is invalid or has expired.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Set new password</h1>
          <p className={styles.subtitle}>
            Choose a strong password for your account.
          </p>
        </header>

        <AppForm<ResetPasswordFormData>
          schema={resetPasswordSchema}
          onSubmit={handleSubmit}
          defaultValues={{ token }}
        >
          {error && (
            <div role="alert" className={styles.errorAlert}>
              {error}
            </div>
          )}
          <AppTextField
            name="password"
            label="New password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
            hint="At least 8 characters with uppercase, lowercase, and a number"
          />
          <AppTextField
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
          {/* Hidden token field — validated server-side */}
          <AppTextField name="token" type="hidden" />
          <AppButton type="submit" fullWidth loading={isLoading}>
            Reset password
          </AppButton>
        </AppForm>
      </div>
    </main>
  );
}
