/**
 * AppButton — enterprise-grade button component.
 *
 * WHY: Never use a UI library button directly in feature code.
 * This wrapper means switching from Material UI to Ant Design
 * requires changing only this file.
 *
 * ACCESSIBILITY: WCAG 2.1 AA compliant — aria-label, disabled state,
 * loading indicator with aria-busy.
 */
import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';

import styles from './AppButton.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

export const AppButton = memo(function AppButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  type = 'button',
  ...props
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <span
          className={styles.spinner}
          aria-hidden="true"
          role="presentation"
        />
      )}
      {!loading && leftIcon && (
        <span className={styles.iconLeft} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {!loading && rightIcon && (
        <span className={styles.iconRight} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});
