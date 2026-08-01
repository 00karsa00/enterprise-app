/**
 * AppTabs — accessible tab component.
 * ACCESSIBILITY: ARIA tablist/tab/tabpanel roles, keyboard navigation (arrow keys).
 */
import { memo, useState, type ReactNode } from 'react';

import styles from './AppTabs.module.css';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface AppTabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  activeTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'pill';
}

export const AppTabs = memo(function AppTabs({
  tabs,
  defaultTabId,
  activeTabId,
  onChange,
  variant = 'line',
}: AppTabsProps) {
  const [internalActive, setInternalActive] = useState(
    defaultTabId ?? tabs[0]?.id ?? '',
  );

  const active = activeTabId ?? internalActive;

  function handleSelect(tabId: string) {
    setInternalActive(tabId);
    onChange?.(tabId);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIdx = enabledTabs.findIndex((t) => t.id === active);

    if (e.key === 'ArrowRight') {
      const next = enabledTabs[(currentIdx + 1) % enabledTabs.length];
      if (next) handleSelect(next.id);
    } else if (e.key === 'ArrowLeft') {
      const prev =
        enabledTabs[
          (currentIdx - 1 + enabledTabs.length) % enabledTabs.length
        ];
      if (prev) handleSelect(prev.id);
    } else if (e.key === 'Home') {
      if (enabledTabs[0]) handleSelect(enabledTabs[0].id);
    } else if (e.key === 'End') {
      const last = enabledTabs[enabledTabs.length - 1];
      if (last) handleSelect(last.id);
    }
    void index;
  }

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div className={styles.tabs}>
      <div
        role="tablist"
        className={[styles.tabList, styles[variant]].join(' ')}
        aria-label="Tabs"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={tab.id === active}
            disabled={tab.disabled}
            className={[
              styles.tab,
              styles[variant],
              tab.id === active ? styles.active : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleSelect(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            tabIndex={tab.id === active ? 0 : -1}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className={styles.badge} aria-label={`${tab.badge} items`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          className={styles.panel}
        >
          {tab.id === active && activeTab?.content}
        </div>
      ))}
    </div>
  );
});
