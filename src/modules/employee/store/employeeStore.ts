/**
 * Employee Store — Zustand state management, hidden behind a clean API.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO IMPORT ZUSTAND IN THE EMPLOYEE MODULE ⚠️
 *
 * WHY: Feature components never call `create()` from Zustand.
 * They call `useEmployeeStore()` which exposes only domain-meaningful methods.
 * Switching from Zustand to Redux requires rewriting only this file.
 *
 * EXPOSED API:
 * - loadEmployees()
 * - createEmployee()
 * - updateEmployee()
 * - deleteEmployee()
 *
 * NEVER EXPOSED:
 * - dispatch()
 * - setState()
 * - create()
 */
import { logger } from '@infrastructure/logger/LoggerFactory';
import { notify } from '@infrastructure/notification/NotificationFactory';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import type { PaginatedResponse } from '@/types';

import { employeeService } from '../services/EmployeeService';
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilters } from '../types';

interface EmployeeStoreState {
  // State
  employees: Employee[];
  selectedEmployee: Employee | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: EmployeeFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions (domain-meaningful, not generic state mutations)
  loadEmployees: (filters?: Partial<EmployeeFilters>) => Promise<void>;
  loadEmployee: (id: string | number) => Promise<void>;
  createEmployee: (data: CreateEmployeeDto) => Promise<Employee | null>;
  updateEmployee: (id: string | number, data: UpdateEmployeeDto) => Promise<Employee | null>;
  deleteEmployee: (id: string | number) => Promise<boolean>;
  selectEmployee: (employee: Employee | null) => void;
  updateFilters: (filters: Partial<EmployeeFilters>) => void;
  clearError: () => void;
}

const defaultFilters: EmployeeFilters = {
  page: 1,
  pageSize: 10,
};

const useEmployeeStoreInternal = create<EmployeeStoreState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      employees: [],
      selectedEmployee: null,
      pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
      filters: defaultFilters,
      isLoading: false,
      isSubmitting: false,
      error: null,

      // Actions
      loadEmployees: async (filters?: Partial<EmployeeFilters>) => {
        const mergedFilters = { ...get().filters, ...filters };
        set({ isLoading: true, error: null, filters: mergedFilters });

        try {
          const result: PaginatedResponse<Employee> = await employeeService.getEmployees(
            mergedFilters,
          );
          set({
            employees: result.items,
            pagination: {
              total: result.total,
              page: result.page,
              pageSize: result.pageSize,
              totalPages: result.totalPages,
            },
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load employees';
          logger.error('Failed to load employees', error);
          set({ error: message, isLoading: false });
          notify.error(message);
        }
      },

      loadEmployee: async (id: string | number) => {
        set({ isLoading: true, error: null });
        try {
          const employee = await employeeService.getEmployee(id);
          set({ selectedEmployee: employee, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load employee';
          logger.error('Failed to load employee', error, { id });
          set({ error: message, isLoading: false });
          notify.error(message);
        }
      },

      createEmployee: async (data: CreateEmployeeDto) => {
        set({ isSubmitting: true, error: null });
        try {
          const employee = await employeeService.createEmployee(data);
          set((state) => ({
            employees: [employee, ...state.employees],
            isSubmitting: false,
          }));
          notify.success(`Employee ${employee.fullName} created successfully`);
          return employee;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create employee';
          logger.error('Failed to create employee', error);
          set({ error: message, isSubmitting: false });
          notify.error(message);
          return null;
        }
      },

      updateEmployee: async (id: string | number, data: UpdateEmployeeDto) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await employeeService.updateEmployee(id, data);
          set((state) => ({
            employees: state.employees.map((e) => (e.id === id ? updated : e)),
            selectedEmployee:
              state.selectedEmployee?.id === id
                ? updated
                : state.selectedEmployee,
            isSubmitting: false,
          }));
          notify.success('Employee updated successfully');
          return updated;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update employee';
          logger.error('Failed to update employee', error, { id });
          set({ error: message, isSubmitting: false });
          notify.error(message);
          return null;
        }
      },

      deleteEmployee: async (id: string | number) => {
        set({ isSubmitting: true, error: null });
        try {
          await employeeService.deleteEmployee(id);
          set((state) => ({
            employees: state.employees.filter((e) => e.id !== id),
            selectedEmployee:
              state.selectedEmployee?.id === id
                ? null
                : state.selectedEmployee,
            isSubmitting: false,
          }));
          notify.success('Employee deleted successfully');
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete employee';
          logger.error('Failed to delete employee', error, { id });
          set({ error: message, isSubmitting: false });
          notify.error(message);
          return false;
        }
      },

      selectEmployee: (employee: Employee | null) => {
        set({ selectedEmployee: employee });
      },

      updateFilters: (filters: Partial<EmployeeFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters, page: 1 },
        }));
      },

      clearError: () => set({ error: null }),
    })),
    { name: 'employee-store' },
  ),
);

/**
 * Public hook — exposes only the clean domain API.
 * Never exposes Zustand internals.
 */
export const useEmployeeStore = useEmployeeStoreInternal;
