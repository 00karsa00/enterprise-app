/**
 * OrganisationRepository — HTTP data access for companies & departments.
 * ⚠️ ONLY THIS FILE is allowed to call httpClient in the organisation module.
 */
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import type { PaginatedResponse } from '@/types';
import type {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../types/organisation.types';

const BASE = '/organisations';

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

export class OrganisationRepository {
  // ── Companies ──────────────────────────────────────────────────────────────

  async getCompanies(page = 1, limit = 20): Promise<PaginatedResponse<Company>> {
    const res = await httpClient.get<ApiSuccessResponse<ApiPaginatedEnvelope<Company>>>(
      `${BASE}/companies`,
      { params: { page, limit } },
    );
    return mapPaginated(res.data.data);
  }

  async getCompany(id: string | number): Promise<Company> {
    const res = await httpClient.get<ApiSuccessResponse<Company>>(`${BASE}/companies/${id}`);
    return res.data.data;
  }

  async createCompany(data: CreateCompanyDto): Promise<Company> {
    const res = await httpClient.post<ApiSuccessResponse<Company>>(`${BASE}/companies`, data);
    return res.data.data;
  }

  async updateCompany(id: string | number, data: UpdateCompanyDto): Promise<Company> {
    const res = await httpClient.patch<ApiSuccessResponse<Company>>(`${BASE}/companies/${id}`, data);
    return res.data.data;
  }

  async deleteCompany(id: string | number): Promise<void> {
    await httpClient.delete(`${BASE}/companies/${id}`);
  }

  // ── Departments ────────────────────────────────────────────────────────────

  async getDepartments(
    page = 1,
    limit = 20,
    companyId?: string | number,
  ): Promise<PaginatedResponse<Department>> {
    const res = await httpClient.get<ApiSuccessResponse<ApiPaginatedEnvelope<Department>>>(
      `${BASE}/departments`,
      { params: { page, limit, companyId } },
    );
    return mapPaginated(res.data.data);
  }

  async getDepartment(id: string | number): Promise<Department> {
    const res = await httpClient.get<ApiSuccessResponse<Department>>(`${BASE}/departments/${id}`);
    return res.data.data;
  }

  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    const res = await httpClient.post<ApiSuccessResponse<Department>>(`${BASE}/departments`, data);
    return res.data.data;
  }

  async updateDepartment(id: string | number, data: UpdateDepartmentDto): Promise<Department> {
    const res = await httpClient.patch<ApiSuccessResponse<Department>>(`${BASE}/departments/${id}`, data);
    return res.data.data;
  }

  async deleteDepartment(id: string | number): Promise<void> {
    await httpClient.delete(`${BASE}/departments/${id}`);
  }
}

export const organisationRepository = new OrganisationRepository();
