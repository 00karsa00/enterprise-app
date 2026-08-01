import { useMutationWrapper } from '@infrastructure/cache/useMutationWrapper';

import { EMPLOYEE_QUERY_KEYS } from '../constants';
import { employeeService } from '../services/EmployeeService';
import type { CreateEmployeeDto } from '../types';

export function useCreateEmployee() {
  return useMutationWrapper({
    mutationFn: (data: CreateEmployeeDto) => employeeService.createEmployee(data),
    invalidateKeys: [EMPLOYEE_QUERY_KEYS.lists()],
  });
}
