import { useQueryWrapper } from '@infrastructure/cache/useQueryWrapper';

import { EMPLOYEE_QUERY_KEYS } from '../constants';
import { employeeService } from '../services/EmployeeService';

export function useEmployeeDetail(id: string | number, enabled = true) {
  return useQueryWrapper({
    queryKey: EMPLOYEE_QUERY_KEYS.detail(id),
    queryFn: () => employeeService.getEmployee(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
}
