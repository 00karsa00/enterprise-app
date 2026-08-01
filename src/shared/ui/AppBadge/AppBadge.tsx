import { memo, type ReactNode } from 'react';

import styles from './AppBadge.module.css';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
export type BadgeSize = 'sm' | 'md';

export interface AppBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean;
}

export const AppBadge = memo(function AppBadge({
  variant = 'default',
  size = 'md',
  children,
  dot = false,
}: AppBadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], styles[size]].join(' ')}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
});
