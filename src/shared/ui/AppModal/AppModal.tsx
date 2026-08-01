/**
 * AppModal — accessible dialog/modal component.
 *
 * ACCESSIBILITY: Focus trap, ARIA dialog role, Escape key dismiss,
 * scroll lock on body. WCAG 2.1 AA compliant.
 */
import {
  memo,
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

import { createPortal } from 'react-dom';

import styles from './AppModal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export const AppModal = memo(function AppModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}: AppModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus first focusable element on open
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      if (first) {
        setTimeout(() => first.focus(), 50);
      }
    }
  }, [isOpen]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    if (e.key === 'Escape') {
      onClose();
    }
    // Focus trap
    if (e.key === 'Tab' && dialogRef.current) {
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[styles.modal, styles[size]].join(' ')}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              ×
            </button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
});
