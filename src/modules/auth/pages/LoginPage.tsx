/**
 * LoginPage — composes the login form with auth business logic.
 *
 * RESPONSIBILITIES:
 *  - Reads the redirect target from navigation state
 *  - Delegates auth to useAuth hook
 *  - Navigates on success
 *
 * ANTI-PATTERN: Never call authService directly from a page.
 *               Never import axios, localStorage, or jwt here.
 */
import { env } from '@core/config/env';
import { ROUTES } from '@core/config/routes';
import { useNavigate, useLocation } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import type { LoginFormData } from '../validators';

import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  // Redirect back to the page that required auth, or fallback to dashboard
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? ROUTES.DASHBOARD;

  async function handleSubmit(data: LoginFormData) {
    const success = await login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
    if (success) {
      void navigate(from, { replace: true });
    }
  }

  return (
    <main className={styles.page} aria-label="Login page">
      {/* Skip link for screen readers */}
      <a href="#login-form" className={styles.skipLink}>
        Skip to login form
      </a>

      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo} aria-hidden="true">⬡</div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in to <strong>{env.VITE_APP_NAME}</strong>
          </p>
        </header>

        <section id="login-form">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errorMessage={error}
            forgotPasswordHref={ROUTES.FORGOT_PASSWORD}
          />
        </section>

        <footer className={styles.footer}>
          <p className={styles.secureNote} aria-label="Security note">
            <span aria-hidden="true">🔒</span> Secured with industry-standard
            encryption
          </p>
        </footer>
      </div>
    </main>
  );
}
