import { memo, type HTMLAttributes, type ReactNode } from 'react';

import styles from './AppCard.module.css';

export interface AppCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  children: ReactNode;
}

export const AppCard = memo(function AppCard({
  title,
  subtitle,
  headerActions,
  footer,
  padding = 'md',
  shadow = 'sm',
  bordered = true,
  children,
  className = '',
  ...props
}: AppCardProps) {
  return (
    <div
      className={[
        styles.card,
        styles[`padding-${padding}`],
        styles[`shadow-${shadow}`],
        bordered ? styles.bordered : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerActions && (
            <div className={styles.headerActions}>{headerActions}</div>
          )}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
});
