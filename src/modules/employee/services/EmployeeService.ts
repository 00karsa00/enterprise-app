/**
 * Employee Service — contains all business logic for the employee domain.
 *
 * WHY: Business logic lives here, not in components or repositories.
 * The service orchestrates: repository calls, validation, transformation,
 * and error mapping. It never touches HTTP or UI.
 *
 * RULE: The service layer must NEVER:
 * - Call httpClient directly (use the repository)
 * - Access localStorage/sessionStorage (use StorageService)
 * - Import React (this is pure business logic)
 * - Import any UI library
 *
 * PATTERN: Service Layer in Clean Architecture.
 */
import { logger } from '@infrastructure/logger/LoggerFactory';

import type { PaginatedResponse } from '@/types';

import { employeeRepository } from '../repository/EmployeeRepository';
import type { IEmployeeRepository } from '../repository/IEmployeeRepository';
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
} from '../types';



export class EmployeeService {
  constructor(
    private readonly repository: IEmployeeRepository = employeeRepository,
  ) {}

  async getEmployees(
    filters: EmployeeFilters,
  ): Promise<PaginatedResponse<Employee>> {
    logger.debug('Fetching employees', { filters });
    return this.repository.findAll(filters);
  }

  async getEmployee(id: string | number): Promise<Employee> {
    logger.debug('Fetching employee', { id });
    return this.repository.findById(id);
  }

  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    logger.info('Creating employee', { email: data.email });
    const employee = await this.repository.create(data);
    logger.info('Employee created', { id: employee.id });
    return employee;
  }

  async updateEmployee(
    id: string | number,
    data: UpdateEmployeeDto,
  ): Promise<Employee> {
    logger.info('Updating employee', { id });
    const employee = await this.repository.update(id, data);
    logger.info('Employee updated', { id });
    return employee;
  }

  async deleteEmployee(id: string | number): Promise<void> {
    logger.info('Deleting employee', { id });
    await this.repository.delete(id);
    logger.info('Employee deleted', { id });
  }

  async exportEmployees(filters?: Partial<EmployeeFilters>): Promise<void> {
    const blob = await this.repository.export(filters);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Business logic: compute the employee's full display name.
   */
  getDisplayName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  /**
   * Business logic: check if an employee is currently active.
   */
  isActive(employee: Employee): boolean {
    return employee.status === 'active';
  }
}

/** Singleton instance */
export const employeeService = new EmployeeService();
