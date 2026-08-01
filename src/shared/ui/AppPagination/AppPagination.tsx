import { memo } from 'react';

import styles from './AppPagination.module.css';

export interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const AppPagination = memo(function AppPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: AppPaginationProps) {
  const from = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const to = Math.min(currentPage * pageSize, totalItems);

  function getPageNumbers(): (number | '...')[] {
    const delta = 2;
    const range: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const pages: (number | '...')[] = [1];

    if (range[0] && range[0] > 2) pages.push('...');
    pages.push(...range);
    if (range[range.length - 1] && range[range.length - 1] < totalPages - 1)
      pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  return (
    <nav
      className={styles.pagination}
      aria-label="Table pagination"
      role="navigation"
    >
      <div className={styles.info} aria-live="polite" aria-atomic="true">
        <span>
          Showing <strong>{from}</strong>–<strong>{to}</strong> of{' '}
          <strong>{totalItems}</strong> items
        </span>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
        >
          «
        </button>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={[
                styles.pageButton,
                page === currentPage ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
        >
          »
        </button>
      </div>

      {onPageSizeChange && (
        <div className={styles.pageSize}>
          <label htmlFor="page-size-select" className={styles.pageSizeLabel}>
            Per page:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
});
