/**
 * AppTable — enterprise data table component.
 *
 * Features: sorting, pagination, row selection, empty state, loading overlay.
 * ACCESSIBILITY: ARIA grid role, keyboard navigation support.
 */
import { memo, type ReactNode } from 'react';

import { AppLoader } from '../AppLoader';

import styles from './AppTable.module.css';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface AppTableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
  onRowClick?: (row: T) => void;
  selectedRows?: Set<string | number>;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  caption?: string;
}

export const AppTable = memo(function AppTable<T extends object>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyMessage = 'No data available.',
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
  selectedRows,
  onSelectRow,
  onSelectAll,
  caption,
}: AppTableProps<T>) {
  const hasSelection = !!onSelectRow;
  const allSelected =
    selectedRows && data.length > 0 && selectedRows.size === data.length;

  function handleSort(key: string): void {
    if (!onSort) return;
    if (sortKey !== key) {
      onSort(key, 'asc');
    } else {
      onSort(key, sortDirection === 'asc' ? 'desc' : null);
    }
  }

  function getSortLabel(key: string): string {
    if (sortKey !== key) return 'Sort ascending';
    if (sortDirection === 'asc') return 'Sort descending';
    return 'Clear sort';
  }

  return (
    <div className={styles.wrapper} role="region" aria-label={caption}>
      {isLoading && (
        <div className={styles.loadingOverlay} aria-live="polite">
          <AppLoader size="md" label="Loading table data..." />
        </div>
      )}
      <div className={styles.tableContainer}>
        <table
          className={styles.table}
          role="grid"
          aria-busy={isLoading}
          aria-label={caption}
        >
          {caption && <caption className={styles.caption}>{caption}</caption>}
          <thead className={styles.thead}>
            <tr>
              {hasSelection && (
                <th className={styles.thCheckbox} scope="col">
                  <input
                    type="checkbox"
                    checked={!!allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  style={{ width: col.width }}
                  className={[
                    styles.th,
                    col.sortable ? styles.sortable : '',
                    col.align ? styles[`align-${col.align}`] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-sort={
                    sortKey === col.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort(String(col.key))}
                      aria-label={`${col.header}: ${getSortLabel(String(col.key))}`}
                    >
                      {col.header}
                      <span className={styles.sortIcon} aria-hidden="true">
                        {sortKey === col.key
                          ? sortDirection === 'asc'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {data.length === 0 && !isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasSelection ? 1 : 0)}
                  className={styles.emptyCell}
                  aria-label={emptyMessage}
                >
                  <div className={styles.empty}>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const id = row[rowKey] as string | number;
                const isSelected = selectedRows?.has(id) ?? false;
                return (
                  <tr
                    key={String(id)}
                    className={[
                      styles.tr,
                      isSelected ? styles.selected : '',
                      onRowClick ? styles.clickable : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                    aria-selected={isSelected}
                  >
                    {hasSelection && (
                      <td className={styles.tdCheckbox}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectRow?.(id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={[
                          styles.td,
                          col.align ? styles[`align-${col.align}`] : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {col.render
                          ? col.render(row, index)
                          : String(row[col.key as keyof T] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}) as <T extends object>(props: AppTableProps<T>) => JSX.Element;
