/**
 * LeaveService — business logic layer for all leave operations.
 */
import { logger } from '@infrastructure/logger/LoggerFactory';
import { leaveRepository } from '../repository/LeaveRepository';
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
import type { PaginatedResponse } from '@/types';

export class LeaveService {
  // ── Leave Types ────────────────────────────────────────────────────────────

  getLeaveTypes(page = 1, limit = 50, companyId?: string | number): Promise<PaginatedResponse<LeaveType>> {
    return leaveRepository.getLeaveTypes(page, limit, companyId);
  }

  getLeaveType(id: string | number): Promise<LeaveType> {
    return leaveRepository.getLeaveType(id);
  }

  async createLeaveType(data: CreateLeaveTypeDto): Promise<LeaveType> {
    logger.info('Creating leave type', { code: data.code });
    const lt = await leaveRepository.createLeaveType(data);
    logger.info('Leave type created', { id: lt.id });
    return lt;
  }

  updateLeaveType(id: string | number, data: UpdateLeaveTypeDto): Promise<LeaveType> {
    return leaveRepository.updateLeaveType(id, data);
  }

  deleteLeaveType(id: string | number): Promise<void> {
    return leaveRepository.deleteLeaveType(id);
  }

  // ── Leave Balances ─────────────────────────────────────────────────────────

  getLeaveBalances(page = 1, limit = 20, employeeId?: string | number, year?: number): Promise<PaginatedResponse<EmployeeLeaveBalance>> {
    return leaveRepository.getLeaveBalances(page, limit, employeeId, year);
  }

  getEmployeeLeaveBalances(employeeId: string | number, year?: number): Promise<EmployeeLeaveBalance[]> {
    return leaveRepository.getEmployeeLeaveBalances(employeeId, year);
  }

  createLeaveBalance(data: CreateLeaveBalanceDto): Promise<EmployeeLeaveBalance> {
    return leaveRepository.createLeaveBalance(data);
  }

  updateLeaveBalance(id: string | number, data: UpdateLeaveBalanceDto): Promise<EmployeeLeaveBalance> {
    return leaveRepository.updateLeaveBalance(id, data);
  }

  deleteLeaveBalance(id: string | number): Promise<void> {
    return leaveRepository.deleteLeaveBalance(id);
  }

  // ── Leave Requests ─────────────────────────────────────────────────────────

  getLeaveRequests(filters: LeaveRequestFilters): Promise<PaginatedResponse<LeaveRequest>> {
    return leaveRepository.getLeaveRequests(filters);
  }

  getLeaveRequest(id: string | number): Promise<LeaveRequest> {
    return leaveRepository.getLeaveRequest(id);
  }

  async createLeaveRequest(data: CreateLeaveRequestDto): Promise<LeaveRequest> {
    logger.info('Submitting leave request', { employeeId: data.employeeId });
    return leaveRepository.createLeaveRequest(data);
  }

  updateLeaveRequest(id: string | number, data: UpdateLeaveRequestDto): Promise<LeaveRequest> {
    return leaveRepository.updateLeaveRequest(id, data);
  }

  cancelLeaveRequest(id: string | number): Promise<LeaveRequest> {
    return leaveRepository.cancelLeaveRequest(id);
  }

  deleteLeaveRequest(id: string | number): Promise<void> {
    return leaveRepository.deleteLeaveRequest(id);
  }
}

export const leaveService = new LeaveService();
