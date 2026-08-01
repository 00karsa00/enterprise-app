import { useMutationWrapper } from '@infrastructure/cache/useMutationWrapper';

import { EMPLOYEE_QUERY_KEYS } from '../constants';
import { employeeService } from '../services/EmployeeService';

export function useDeleteEmployee() {
  return useMutationWrapper({
    mutationFn: (id: string | number) => employeeService.deleteEmployee(id),
    invalidateKeys: [EMPLOYEE_QUERY_KEYS.lists()],
  });
}
