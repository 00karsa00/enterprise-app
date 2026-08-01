/**
 * AppLoader — loading state indicator.
 * Full-screen, inline, and overlay variants.
 */
import { memo } from 'react';

import styles from './AppLoader.module.css';

export type LoaderVariant = 'spinner' | 'dots' | 'bar';
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AppLoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  label?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export const AppLoader = memo(function AppLoader({
  variant = 'spinner',
  size = 'md',
  label = 'Loading...',
  fullScreen = false,
  overlay = false,
}: AppLoaderProps) {
  const loaderEl = (
    <div
      className={[styles.loader, styles[size]].join(' ')}
      role="status"
      aria-label={label}
    >
      {variant === 'spinner' && (
        <div className={styles.spinner} aria-hidden="true" />
      )}
      {variant === 'dots' && (
        <div className={styles.dots} aria-hidden="true">
          <span /><span /><span />
        </div>
      )}
      {variant === 'bar' && (
        <div className={styles.bar} aria-hidden="true">
          <div className={styles.barFill} />
        </div>
      )}
      <span className={styles.srOnly}>{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{loaderEl}</div>;
  }

  if (overlay) {
    return (
      <div className={styles.overlay} aria-modal="true">
        {loaderEl}
      </div>
    );
  }

  return loaderEl;
});
