/**
 * AppDrawer — slide-in panel from any edge. Portal-based, focus-trapped.
 * ACCESSIBILITY: dialog role, focus trap, Escape key dismiss, aria-modal.
 */
import {
  memo,
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

import { createPortal } from 'react-dom';

import styles from './AppDrawer.module.css';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  closeOnOverlayClick?: boolean;
}

export const AppDrawer = memo(function AppDrawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  placement = 'right',
  size = 'md',
  closeOnOverlayClick = true,
}: AppDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const titleId = `drawer-title-${Math.random().toString(36).slice(2)}`;

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => drawerRef.current?.focus(), 50);
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab' && drawerRef.current) {
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={closeOnOverlayClick ? onClose : undefined}
      aria-hidden="true"
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[styles.drawer, styles[placement], styles[size]].join(' ')}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close drawer"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
});
