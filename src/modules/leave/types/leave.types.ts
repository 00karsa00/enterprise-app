/**
 * Leave module domain types.
 */
import type { ID, ISODateString } from '@/types';

// ─── Leave Types ─────────────────────────────────────────────────────────────

export interface LeaveType {
  id: ID;
  companyId: ID;
  name: string;
  code: string;
  description?: string | null;
  daysAllowed: number;
  carryForward: boolean;
  maxCarryForward: number;
  requiresApproval: boolean;
  isPaid: boolean;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateLeaveTypeDto {
  companyId: ID;
  name: string;
  code: string;
  description?: string;
  daysAllowed: number;
  carryForward?: boolean;
  maxCarryForward?: number;
  requiresApproval?: boolean;
  isPaid?: boolean;
}

export type UpdateLeaveTypeDto = Partial<CreateLeaveTypeDto> & { isActive?: boolean };

// ─── Leave Balance ────────────────────────────────────────────────────────────

export interface EmployeeLeaveBalance {
  id: ID;
  employeeId: ID;
  leaveTypeId: ID;
  leaveType?: LeaveType;
  year: number;
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  carriedDays: number;
  availableDays?: number; // computed: totalDays + carriedDays - usedDays - pendingDays
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateLeaveBalanceDto {
  employeeId: ID;
  leaveTypeId: ID;
  year: number;
  totalDays: number;
  carriedDays?: number;
}

export type UpdateLeaveBalanceDto = Partial<{
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  carriedDays: number;
}>;

// ─── Leave Request ────────────────────────────────────────────────────────────

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: ID;
  employeeId: ID;
  leaveTypeId: ID;
  leaveType?: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  halfDay: boolean;
  reason?: string | null;
  status: LeaveRequestStatus;
  reviewedBy?: ID | null;
  reviewedAt?: ISODateString | null;
  rejectionReason?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateLeaveRequestDto {
  employeeId: ID;
  leaveTypeId: ID;
  startDate: string;
  endDate: string;
  totalDays: number;
  halfDay?: boolean;
  reason?: string;
}

export interface UpdateLeaveRequestDto {
  status?: LeaveRequestStatus;
  rejectionReason?: string;
  reviewedBy?: ID;
}

export interface LeaveRequestFilters {
  page?: number;
  limit?: number;
  employeeId?: ID;
  leaveTypeId?: ID;
  status?: LeaveRequestStatus;
}
