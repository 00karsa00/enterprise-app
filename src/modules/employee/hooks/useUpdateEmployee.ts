import { useMutationWrapper } from '@infrastructure/cache/useMutationWrapper';

import { EMPLOYEE_QUERY_KEYS } from '../constants';
import { employeeService } from '../services/EmployeeService';
import type { UpdateEmployeeDto } from '../types';

export function useUpdateEmployee(id: string | number) {
  return useMutationWrapper({
    mutationFn: (data: UpdateEmployeeDto) => employeeService.updateEmployee(id, data),
    invalidateKeys: [
      EMPLOYEE_QUERY_KEYS.lists(),
      EMPLOYEE_QUERY_KEYS.detail(id),
    ],
  });
}
