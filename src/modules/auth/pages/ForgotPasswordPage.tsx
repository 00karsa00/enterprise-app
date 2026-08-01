/**
 * ForgotPasswordPage — initiates the password reset flow.
 */
import { useState } from 'react';

import { ROUTES } from '@core/config/routes';
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import { AppForm } from '@shared/form/AppForm';
import { AppTextField } from '@shared/form/AppTextField';
import { AppButton } from '@shared/ui/AppButton';
import { Link } from 'react-router-dom';

import { forgotPasswordSchema, type ForgotPasswordFormData } from '../validators';

import styles from './AuthPage.module.css';

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    setError(null);
    try {
      await httpClient.post('/auth/forgot-password', { email: data.email });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon} aria-hidden="true">✉️</div>
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.message}>
            We've sent a password reset link to your email address. The link
            expires in 1 hour.
          </p>
          <Link to={ROUTES.LOGIN} className={styles.backLink}>
            ← Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Reset your password</h1>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a reset link.
          </p>
        </header>

        <AppForm<ForgotPasswordFormData>
          schema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {error && (
            <div role="alert" className={styles.errorAlert}>
              {error}
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
          <AppButton type="submit" fullWidth loading={isLoading}>
            Send reset link
          </AppButton>
        </AppForm>

        <Link to={ROUTES.LOGIN} className={styles.backLink}>
          ← Back to sign in
        </Link>
      </div>
    </main>
  );
}
