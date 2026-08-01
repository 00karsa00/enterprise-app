/**
 * Employee Repository interface.
 *
 * WHY: Defines the data access contract. The service layer depends on this
 * interface, never on the concrete HTTP implementation.
 * Swapping from REST to GraphQL requires only a new repository implementation.
 *
 * RULE: Repository methods ONLY perform data access.
 * No business logic. No state management. No notifications.
 */
import type { PaginatedResponse } from '@/types';

import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
} from '../types';

export interface IEmployeeRepository {
  findAll(filters: EmployeeFilters): Promise<PaginatedResponse<Employee>>;
  findById(id: string | number): Promise<Employee>;
  create(data: CreateEmployeeDto): Promise<Employee>;
  update(id: string | number, data: UpdateEmployeeDto): Promise<Employee>;
  delete(id: string | number): Promise<void>;
  export(filters?: Partial<EmployeeFilters>): Promise<Blob>;
}
