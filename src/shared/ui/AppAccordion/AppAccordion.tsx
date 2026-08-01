/**
 * AppAccordion — ARIA-compliant expand/collapse panels.
 * ACCESSIBILITY: aria-expanded, aria-controls, keyboard support.
 */
import { memo, useState, type ReactNode } from 'react';

import styles from './AppAccordion.module.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

export interface AppAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const AppAccordion = memo(function AppAccordion({
  items,
  allowMultiple = false,
}: AppAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(items.filter((i) => i.defaultOpen).map((i) => i.id)),
  );

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={`accordion-trigger-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${item.id}`}
                className={[
                  styles.trigger,
                  isOpen ? styles.open : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
                <span
                  className={[styles.icon, isOpen ? styles.iconOpen : '']
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                >
                  ›
                </span>
              </button>
            </h3>
            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
              className={[
                styles.panel,
                isOpen ? styles.panelOpen : '',
              ]
                .filter(Boolean)
                .join(' ')}
              hidden={!isOpen}
            >
              <div className={styles.panelContent}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
