/**
 * Global Error Boundary.
 *
 * WHY: Catches React render errors that slip through try/catch.
 * Prevents the entire app from crashing on unhandled errors.
 * Provides user-friendly fallback UI and error reporting.
 *
 * PATTERN: React class component (required for error boundaries).
 */
import { Component, type ReactNode, type ErrorInfo } from 'react';

import { logger } from '@infrastructure/logger/LoggerFactory';

import styles from './ErrorBoundary.module.css';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.fatal('React error boundary caught an error', error, {
      componentStack: info.componentStack,
    });
    this.props.onError?.(error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.container} role="alert" aria-live="assertive">
          <div className={styles.content}>
            <div className={styles.icon} aria-hidden="true">
              ⚠️
            </div>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
              An unexpected error occurred. Our team has been notified.
            </p>
            {import.meta.env.MODE === 'development' && this.state.error && (
              <details className={styles.details}>
                <summary>Error details (development only)</summary>
                <pre className={styles.stack}>
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryAction}
                onClick={this.handleReset}
              >
                Try again
              </button>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => (window.location.href = '/')}
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
