/**
 * LeaveRepository — HTTP data access for all leave resources.
 * ⚠️ ONLY THIS FILE calls httpClient in the leave module.
 */
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import type { PaginatedResponse } from '@/types';
import type {
  LeaveType,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  EmployeeLeaveBalance,
  CreateLeaveBalanceDto,
  UpdateLeaveBalanceDto,
  LeaveRequest,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  LeaveRequestFilters,
} from '../types/leave.types';

const BASE = '/leave';

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

export class LeaveRepository {
  // ── Leave Types ────────────────────────────────────────────────────────────

  async getLeaveTypes(page = 1, limit = 50, companyId?: string | number): Promise<PaginatedResponse<LeaveType>> {
    const res = await httpClient.get<ApiSuccessResponse<ApiPaginatedEnvelope<LeaveType>>>(`${BASE}/types`, {
      params: { page, limit, companyId },
    });
    return mapPaginated(res.data.data);
  }

  async getLeaveType(id: string | number): Promise<LeaveType> {
    const res = await httpClient.get<ApiSuccessResponse<LeaveType>>(`${BASE}/types/${id}`);
    return res.data.data;
  }

  async createLeaveType(data: CreateLeaveTypeDto): Promise<LeaveType> {
    const res = await httpClient.post<ApiSuccessResponse<LeaveType>>(`${BASE}/types`, data);
    return res.data.data;
  }

  async updateLeaveType(id: string | number, data: UpdateLeaveTypeDto): Promise<LeaveType> {
    const res = await httpClient.patch<ApiSuccessResponse<LeaveType>>(`${BASE}/types/${id}`, data);
    return res.data.data;
  }

  async deleteLeaveType(id: string | number): Promise<void> {
    await httpClient.delete(`${BASE}/types/${id}`);
  }

  // ── Leave Balances ─────────────────────────────────────────────────────────

  async getLeaveBalances(
    page = 1,
    limit = 20,
    employeeId?: string | number,
    year?: number,
  ): Promise<PaginatedResponse<EmployeeLeaveBalance>> {
    const res = await httpClient.get<ApiSuccessResponse<ApiPaginatedEnvelope<EmployeeLeaveBalance>>>(`${BASE}/balances`, {
      params: { page, limit, employeeId, year },
    });
    return mapPaginated(res.data.data);
  }

  async getEmployeeLeaveBalances(employeeId: string | number, year?: number): Promise<EmployeeLeaveBalance[]> {
    const res = await httpClient.get<ApiSuccessResponse<EmployeeLeaveBalance[]>>(
      `${BASE}/balances/employee/${employeeId}`,
      { params: { year } },
    );
    return res.data.data;
  }

  async createLeaveBalance(data: CreateLeaveBalanceDto): Promise<EmployeeLeaveBalance> {
    const res = await httpClient.post<ApiSuccessResponse<EmployeeLeaveBalance>>(`${BASE}/balances`, data);
    return res.data.data;
  }

  async updateLeaveBalance(id: string | number, data: UpdateLeaveBalanceDto): Promise<EmployeeLeaveBalance> {
    const res = await httpClient.patch<ApiSuccessResponse<EmployeeLeaveBalance>>(`${BASE}/balances/${id}`, data);
    return res.data.data;
  }

  async deleteLeaveBalance(id: string | number): Promise<void> {
    await httpClient.delete(`${BASE}/balances/${id}`);
  }

  // ── Leave Requests ─────────────────────────────────────────────────────────

  async getLeaveRequests(filters: LeaveRequestFilters): Promise<PaginatedResponse<LeaveRequest>> {
    const res = await httpClient.get<ApiSuccessResponse<ApiPaginatedEnvelope<LeaveRequest>>>(`${BASE}/requests`, {
      params: filters,
    });
    return mapPaginated(res.data.data);
  }

  async getLeaveRequest(id: string | number): Promise<LeaveRequest> {
    const res = await httpClient.get<ApiSuccessResponse<LeaveRequest>>(`${BASE}/requests/${id}`);
    return res.data.data;
  }

  async createLeaveRequest(data: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const res = await httpClient.post<ApiSuccessResponse<LeaveRequest>>(`${BASE}/requests`, data);
    return res.data.data;
  }

  async updateLeaveRequest(id: string | number, data: UpdateLeaveRequestDto): Promise<LeaveRequest> {
    const res = await httpClient.patch<ApiSuccessResponse<LeaveRequest>>(`${BASE}/requests/${id}`, data);
    return res.data.data;
  }

  async cancelLeaveRequest(id: string | number): Promise<LeaveRequest> {
    const res = await httpClient.patch<ApiSuccessResponse<LeaveRequest>>(`${BASE}/requests/${id}/cancel`);
    return res.data.data;
  }

  async deleteLeaveRequest(id: string | number): Promise<void> {
    await httpClient.delete(`${BASE}/requests/${id}`);
  }
}

export const leaveRepository = new LeaveRepository();
