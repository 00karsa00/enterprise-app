/**
 * AppTooltip — CSS-only tooltip (no JS library dependency).
 * ACCESSIBILITY: Uses aria-label + role="tooltip" pattern.
 */
import { memo, type ReactNode } from 'react';

import styles from './AppTooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface AppTooltipProps {
  content: string;
  children: ReactNode;
  placement?: TooltipPlacement;
  disabled?: boolean;
}

export const AppTooltip = memo(function AppTooltip({
  content,
  children,
  placement = 'top',
  disabled = false,
}: AppTooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <div className={styles.wrapper}>
      {children}
      <div
        role="tooltip"
        className={[styles.tooltip, styles[placement]].join(' ')}
        aria-label={content}
      >
        {content}
      </div>
    </div>
  );
});
