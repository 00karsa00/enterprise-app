/**
 * EmployeeListPage — the employee list feature page.
 *
 * RESPONSIBILITIES:
 * - Orchestrate data loading via hooks
 * - Manage local UI state (modals, selected items)
 * - Compose presentational components
 *
 * ANTI-PATTERN: Never put business logic or HTTP calls in a page component.
 */
import { useState, useCallback } from 'react';

import { buildRoute, ROUTES } from '@core/config/routes';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useDisclosure } from '@shared/hooks/useDisclosure';
import { usePagination } from '@shared/hooks/usePagination';
import { AppButton } from '@shared/ui/AppButton';
import { AppCard } from '@shared/ui/AppCard';
import { AppInput } from '@shared/ui/AppInput';
import { AppLoader } from '@shared/ui/AppLoader';
import { AppModal } from '@shared/ui/AppModal';
import type { SortDirection } from '@shared/ui/AppTable';
import { useNavigate } from 'react-router-dom';

import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeTable } from '../components/EmployeeTable';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import { useDeleteEmployee } from '../hooks/useDeleteEmployee';
import { useEmployeeList } from '../hooks/useEmployeeList';
import type { Employee } from '../types';
import type { CreateEmployeeFormData } from '../validators';


import styles from './EmployeeListPage.module.css';

export function EmployeeListPage() {
  const navigate = useNavigate();
  const { page, pageSize, setPage, setPageSize } = usePagination(1, 10);
  const [searchInput, setSearchInput] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const createModal = useDisclosure();
  const deleteModal = useDisclosure();

  const debouncedSearch = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching } = useEmployeeList({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    sort: sortKey && sortDirection
      ? { field: sortKey, direction: sortDirection }
      : undefined,
  });

  const createEmployee = useCreateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const handleSort = useCallback(
    (key: string, direction: SortDirection) => {
      setSortKey(direction ? key : null);
      setSortDirection(direction);
    },
    [],
  );

  const handleCreateSubmit = useCallback(
    async (formData: CreateEmployeeFormData) => {
      const result = await createEmployee.mutateAsync({
        ...formData,
        phone: formData.phone ?? undefined,
        salary: formData.salary ?? undefined,
      });
      if (result) createModal.close();
    },
    [createEmployee, createModal],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!employeeToDelete) return;
    await deleteEmployee.mutateAsync(employeeToDelete.id);
    setEmployeeToDelete(null);
    deleteModal.close();
  }, [employeeToDelete, deleteEmployee, deleteModal]);

  const handleViewDetail = useCallback(
    (employee: Employee) => {
      void navigate(buildRoute(ROUTES.EMPLOYEE_DETAIL, { id: String(employee.id) }));
    },
    [navigate],
  );

  const handleEditClick = useCallback(
    (employee: Employee) => {
      void navigate(buildRoute(ROUTES.EMPLOYEE_EDIT, { id: String(employee.id) }));
    },
    [navigate],
  );

  const handleDeleteClick = useCallback(
    (employee: Employee) => {
      setEmployeeToDelete(employee);
      deleteModal.open();
    },
    [deleteModal],
  );

  const employees = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Employees</h1>
          <p className={styles.subtitle}>
            Manage your organization's employees
          </p>
        </div>
        <AppButton
          onClick={createModal.open}
          aria-label="Add new employee"
        >
          + Add Employee
        </AppButton>
      </div>

      <AppCard padding="none" shadow="sm">
        <div className={styles.toolbar}>
          <AppInput
            type="search"
            placeholder="Search employees..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            aria-label="Search employees"
            fullWidth={false}
            className={styles.searchInput}
          />
          {isFetching && !isLoading && (
            <AppLoader size="sm" label="Refreshing..." />
          )}
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <AppLoader size="lg" label="Loading employees..." />
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isFetching && !isLoading}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewDetail={handleViewDetail}
          />
        )}
      </AppCard>

      {/* Create Employee Modal */}
      <AppModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Add New Employee"
        size="lg"
      >
        <EmployeeForm
          onSubmit={handleCreateSubmit}
          onCancel={createModal.close}
          isLoading={createEmployee.isLoading}
          submitLabel="Create Employee"
        />
      </AppModal>

      {/* Delete Confirmation Modal */}
      <AppModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        title="Delete Employee"
        size="sm"
        footer={
          <>
            <AppButton
              variant="secondary"
              onClick={deleteModal.close}
              disabled={deleteEmployee.isLoading}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={deleteEmployee.isLoading}
            >
              Delete
            </AppButton>
          </>
        }
      >
        <p className={styles.deleteMessage}>
          Are you sure you want to delete{' '}
          <strong>{employeeToDelete?.fullName}</strong>? This action cannot be
          undone.
        </p>
      </AppModal>
    </div>
  );
}
