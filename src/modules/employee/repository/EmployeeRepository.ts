/**
 * Employee Repository — HTTP implementation.
 *
 * WHY: This is the ONLY place in the employee module that calls httpClient.
 * The service layer calls this repository and never makes HTTP calls directly.
 *
 * DEPENDENCY FLOW:
 * EmployeePage → EmployeeService → EmployeeRepository → httpClient → Axios
 *
 * PATTERN: Repository Pattern — encapsulates all data access logic.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO CALL httpClient IN THE EMPLOYEE MODULE ⚠️
 */
import { endpoints } from '@core/config/api';
import { httpClient } from '@infrastructure/http/HttpClientFactory';

import type { PaginatedResponse } from '@/types';

import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
} from '../types';

import type { IEmployeeRepository } from './IEmployeeRepository';


export class EmployeeRepository implements IEmployeeRepository {
  async findAll(filters: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    const response = await httpClient.get<PaginatedResponse<Employee>>(
      endpoints.employees.list,
      {
        params: {
          page: filters.page,
          pageSize: filters.pageSize,
          search: filters.search,
          departmentId: filters.departmentId,
          status: filters.status,
          contractType: filters.contractType,
          managerId: filters.managerId,
          sortField: filters.sort?.field,
          sortDirection: filters.sort?.direction,
        },
      },
    );
    return response.data;
  }

  async findById(id: string | number): Promise<Employee> {
    const response = await httpClient.get<Employee>(
      endpoints.employees.byId(id),
    );
    return response.data;
  }

  async create(data: CreateEmployeeDto): Promise<Employee> {
    const response = await httpClient.post<Employee>(
      endpoints.employees.create,
      data,
    );
    return response.data;
  }

  async update(
    id: string | number,
    data: UpdateEmployeeDto,
  ): Promise<Employee> {
    const response = await httpClient.patch<Employee>(
      endpoints.employees.update(id),
      data,
    );
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    await httpClient.delete(endpoints.employees.delete(id));
  }

  async export(filters?: Partial<EmployeeFilters>): Promise<Blob> {
    const response = await httpClient.get<Blob>(endpoints.employees.export, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
}

/** Singleton instance */
export const employeeRepository = new EmployeeRepository();
