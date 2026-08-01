import type { EmployeeStatus, ContractType } from '../types';

export const EMPLOYEE_QUERY_KEYS = {
  all: ['employees'] as const,
  lists: () => [...EMPLOYEE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: object) => [...EMPLOYEE_QUERY_KEYS.lists(), filters] as const,
  details: () => [...EMPLOYEE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...EMPLOYEE_QUERY_KEYS.details(), id] as const,
} as const;

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  on_leave: 'On Leave',
  terminated: 'Terminated',
};

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contractor: 'Contractor',
  intern: 'Intern',
};

export const EMPLOYEE_STATUS_VARIANT = {
  active: 'success',
  inactive: 'default',
  on_leave: 'warning',
  terminated: 'danger',
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
