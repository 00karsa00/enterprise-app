/**
 * useEmployeeList — hook for employee list data with caching.
 *
 * Uses the cache layer wrapper (not TanStack Query directly).
 * Combines server-state caching with URL-synchronized filters.
 */
import { useQueryWrapper } from '@infrastructure/cache/useQueryWrapper';

import { EMPLOYEE_QUERY_KEYS } from '../constants';
import { employeeService } from '../services/EmployeeService';
import type { EmployeeFilters } from '../types';

export function useEmployeeList(filters: EmployeeFilters) {
  return useQueryWrapper({
    queryKey: EMPLOYEE_QUERY_KEYS.list(filters),
    queryFn: () => employeeService.getEmployees(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes — employees change frequently
  });
}
