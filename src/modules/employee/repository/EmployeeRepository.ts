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

/** Shape of the raw paginated envelope returned by the API. */
interface ApiPaginatedEnvelope<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Top-level API success wrapper: { success, data: <payload>, meta } */
interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

/** Maps the API paginated envelope to the frontend PaginatedResponse shape. */
function mapPaginated<T>(envelope: ApiPaginatedEnvelope<T>): PaginatedResponse<T> {
  return {
    items: envelope.items,
    total: envelope.total,
    page: envelope.page,
    pageSize: envelope.limit,
    totalPages: envelope.totalPages,
    hasNextPage: envelope.hasNext,
    hasPreviousPage: envelope.hasPrev,
  };
}

export class EmployeeRepository implements IEmployeeRepository {
  async findAll(filters: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    const response = await httpClient.get<ApiSuccessResponse<ApiPaginatedEnvelope<Employee>>>(
      endpoints.employees.list,
      {
        params: {
          page: filters.page,
          limit: filters.pageSize,   // API expects "limit", not "pageSize"
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
    return mapPaginated(response.data.data);
  }

  async findById(id: string | number): Promise<Employee> {
    const response = await httpClient.get<ApiSuccessResponse<Employee>>(
      endpoints.employees.byId(id),
    );
    return response.data.data;
  }

  async create(data: CreateEmployeeDto): Promise<Employee> {
    const response = await httpClient.post<ApiSuccessResponse<Employee>>(
      endpoints.employees.create,
      data,
    );
    return response.data.data;
  }

  async update(
    id: string | number,
    data: UpdateEmployeeDto,
  ): Promise<Employee> {
    const response = await httpClient.patch<ApiSuccessResponse<Employee>>(
      endpoints.employees.update(id),
      data,
    );
    return response.data.data;
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
