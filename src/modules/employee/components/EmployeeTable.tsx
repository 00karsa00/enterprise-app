/**
 * EmployeeTable — displays the employee list.
 * Pure presentational component — receives data via props, emits events.
 */
import { memo, useCallback } from 'react';

import { AppButton } from '@shared/ui/AppButton';
import { AppPagination } from '@shared/ui/AppPagination';
import { AppTable, type TableColumn } from '@shared/ui/AppTable';
import type { SortDirection } from '@shared/ui/AppTable';

import { CONTRACT_TYPE_LABELS } from '../constants';
import type { Employee } from '../types';

import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import styles from './EmployeeTable.module.css';

interface EmployeeTableProps {
  employees: Employee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading?: boolean;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onViewDetail: (employee: Employee) => void;
}

export const EmployeeTable = memo(function EmployeeTable({
  employees,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  sortKey,
  sortDirection,
  onSort,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onViewDetail,
}: EmployeeTableProps) {
  const handleEdit = useCallback(
    (e: React.MouseEvent, employee: Employee) => {
      e.stopPropagation();
      onEdit(employee);
    },
    [onEdit],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, employee: Employee) => {
      e.stopPropagation();
      onDelete(employee);
    },
    [onDelete],
  );

  const columns: TableColumn<Employee>[] = [
    {
      key: 'fullName',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <div className={styles.nameCell}>
          <div className={styles.avatar} aria-hidden="true">
            {row.avatarUrl ? (
              <img
                src={row.avatarUrl}
                alt=""
                className={styles.avatarImg}
                loading="lazy"
              />
            ) : (
              <span>{`${row.firstName[0] ?? ''}${row.lastName[0] ?? ''}`}</span>
            )}
          </div>
          <div>
            <p className={styles.name}>{row.fullName}</p>
            <p className={styles.email}>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Job Title',
      sortable: true,
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => row.department.name,
    },
    {
      key: 'contractType',
      header: 'Contract',
      render: (row) => CONTRACT_TYPE_LABELS[row.contractType],
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <EmployeeStatusBadge status={row.status} />,
    },
    {
      key: 'hireDate',
      header: 'Hire Date',
      sortable: true,
      render: (row) =>
        new Date(row.hireDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className={styles.actions}>
          <AppButton
            size="sm"
            variant="ghost"
            onClick={(e) => handleEdit(e, row)}
            aria-label={`Edit ${row.fullName}`}
          >
            Edit
          </AppButton>
          <AppButton
            size="sm"
            variant="danger"
            onClick={(e) => handleDelete(e, row)}
            aria-label={`Delete ${row.fullName}`}
          >
            Delete
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AppTable
        columns={columns}
        data={employees}
        rowKey="id"
        isLoading={isLoading}
        emptyMessage="No employees found. Try adjusting your filters."
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
        onRowClick={onViewDetail}
        caption="Employee list"
      />
      <AppPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
});
