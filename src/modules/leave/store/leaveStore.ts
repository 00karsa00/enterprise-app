/**
 * Leave Store — Zustand state for leave types, balances & requests.
 * ⚠️ ONLY THIS FILE imports Zustand in the leave module.
 */
import { logger } from '@infrastructure/logger/LoggerFactory';
import { notify } from '@infrastructure/notification/NotificationFactory';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { leaveService } from '../services/LeaveService';
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

interface LeaveStoreState {
  // Leave Types
  leaveTypes: LeaveType[];
  selectedLeaveType: LeaveType | null;

  // Leave Balances
  leaveBalances: EmployeeLeaveBalance[];
  employeeBalances: EmployeeLeaveBalance[];

  // Leave Requests
  leaveRequests: LeaveRequest[];
  selectedLeaveRequest: LeaveRequest | null;
  requestPagination: { total: number; page: number; totalPages: number };
  requestFilters: LeaveRequestFilters;

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Leave Type actions
  loadLeaveTypes: (companyId?: string | number) => Promise<void>;
  createLeaveType: (data: CreateLeaveTypeDto) => Promise<LeaveType | null>;
  updateLeaveType: (id: string | number, data: UpdateLeaveTypeDto) => Promise<LeaveType | null>;
  deleteLeaveType: (id: string | number) => Promise<boolean>;

  // Balance actions
  loadLeaveBalances: (employeeId?: string | number, year?: number) => Promise<void>;
  loadEmployeeBalances: (employeeId: string | number, year?: number) => Promise<void>;
  createLeaveBalance: (data: CreateLeaveBalanceDto) => Promise<EmployeeLeaveBalance | null>;
  updateLeaveBalance: (id: string | number, data: UpdateLeaveBalanceDto) => Promise<EmployeeLeaveBalance | null>;
  deleteLeaveBalance: (id: string | number) => Promise<boolean>;

  // Request actions
  loadLeaveRequests: (filters?: Partial<LeaveRequestFilters>) => Promise<void>;
  createLeaveRequest: (data: CreateLeaveRequestDto) => Promise<LeaveRequest | null>;
  approveLeaveRequest: (id: string | number, reviewedBy?: string | number) => Promise<boolean>;
  rejectLeaveRequest: (id: string | number, reason: string, reviewedBy?: string | number) => Promise<boolean>;
  cancelLeaveRequest: (id: string | number) => Promise<boolean>;
  deleteLeaveRequest: (id: string | number) => Promise<boolean>;

  clearError: () => void;
}

const useLeaveStoreInternal = create<LeaveStoreState>()(
  devtools(
    (set, get) => ({
      leaveTypes: [],
      selectedLeaveType: null,
      leaveBalances: [],
      employeeBalances: [],
      leaveRequests: [],
      selectedLeaveRequest: null,
      requestPagination: { total: 0, page: 1, totalPages: 0 },
      requestFilters: { page: 1, limit: 20 },
      isLoading: false,
      isSubmitting: false,
      error: null,

      // ── Leave Types ──────────────────────────────────────────────────────
      loadLeaveTypes: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
          const result = await leaveService.getLeaveTypes(1, 100, companyId);
          set({ leaveTypes: result.items, isLoading: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load leave types';
          set({ error: msg, isLoading: false });
          notify.error(msg);
        }
      },

      createLeaveType: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const lt = await leaveService.createLeaveType(data);
          set((state) => ({ leaveTypes: [lt, ...state.leaveTypes], isSubmitting: false }));
          notify.success(`Leave type "${lt.name}" created`);
          return lt;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to create leave type';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      updateLeaveType: async (id, data) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await leaveService.updateLeaveType(id, data);
          set((state) => ({
            leaveTypes: state.leaveTypes.map((lt) => (lt.id === id ? updated : lt)),
            isSubmitting: false,
          }));
          notify.success('Leave type updated');
          return updated;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to update leave type';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      deleteLeaveType: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await leaveService.deleteLeaveType(id);
          set((state) => ({ leaveTypes: state.leaveTypes.filter((lt) => lt.id !== id), isSubmitting: false }));
          notify.success('Leave type deleted');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to delete leave type';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      // ── Balances ──────────────────────────────────────────────────────────
      loadLeaveBalances: async (employeeId, year) => {
        set({ isLoading: true, error: null });
        try {
          const result = await leaveService.getLeaveBalances(1, 100, employeeId, year);
          set({ leaveBalances: result.items, isLoading: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load balances';
          set({ error: msg, isLoading: false });
        }
      },

      loadEmployeeBalances: async (employeeId, year) => {
        set({ isLoading: true, error: null });
        try {
          const balances = await leaveService.getEmployeeLeaveBalances(employeeId, year);
          set({ employeeBalances: balances, isLoading: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load employee balances';
          set({ error: msg, isLoading: false });
        }
      },

      createLeaveBalance: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const balance = await leaveService.createLeaveBalance(data);
          set((state) => ({ leaveBalances: [balance, ...state.leaveBalances], isSubmitting: false }));
          notify.success('Leave balance created');
          return balance;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to create leave balance';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      updateLeaveBalance: async (id, data) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await leaveService.updateLeaveBalance(id, data);
          set((state) => ({
            leaveBalances: state.leaveBalances.map((b) => (b.id === id ? updated : b)),
            isSubmitting: false,
          }));
          notify.success('Leave balance updated');
          return updated;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to update leave balance';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      deleteLeaveBalance: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await leaveService.deleteLeaveBalance(id);
          set((state) => ({ leaveBalances: state.leaveBalances.filter((b) => b.id !== id), isSubmitting: false }));
          notify.success('Leave balance deleted');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to delete leave balance';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      // ── Requests ──────────────────────────────────────────────────────────
      loadLeaveRequests: async (filters) => {
        const mergedFilters = { ...get().requestFilters, ...filters };
        set({ isLoading: true, error: null, requestFilters: mergedFilters });
        try {
          const result = await leaveService.getLeaveRequests(mergedFilters);
          set({
            leaveRequests: result.items,
            requestPagination: { total: result.total, page: result.page, totalPages: result.totalPages },
            isLoading: false,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load leave requests';
          set({ error: msg, isLoading: false });
          notify.error(msg);
        }
      },

      createLeaveRequest: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const req = await leaveService.createLeaveRequest(data);
          set((state) => ({ leaveRequests: [req, ...state.leaveRequests], isSubmitting: false }));
          notify.success('Leave request submitted');
          return req;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to submit leave request';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      approveLeaveRequest: async (id, reviewedBy) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await leaveService.updateLeaveRequest(id, { status: 'approved', reviewedBy });
          set((state) => ({
            leaveRequests: state.leaveRequests.map((r) => (r.id === id ? updated : r)),
            isSubmitting: false,
          }));
          notify.success('Leave request approved');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to approve request';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      rejectLeaveRequest: async (id, reason, reviewedBy) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await leaveService.updateLeaveRequest(id, { status: 'rejected', rejectionReason: reason, reviewedBy });
          set((state) => ({
            leaveRequests: state.leaveRequests.map((r) => (r.id === id ? updated : r)),
            isSubmitting: false,
          }));
          notify.success('Leave request rejected');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to reject request';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      cancelLeaveRequest: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await leaveService.cancelLeaveRequest(id);
          set((state) => ({
            leaveRequests: state.leaveRequests.map((r) => (r.id === id ? updated : r)),
            isSubmitting: false,
          }));
          notify.success('Leave request cancelled');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to cancel request';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      deleteLeaveRequest: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await leaveService.deleteLeaveRequest(id);
          set((state) => ({ leaveRequests: state.leaveRequests.filter((r) => r.id !== id), isSubmitting: false }));
          notify.success('Leave request deleted');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to delete request';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'leave-store' },
  ),
);

export const useLeaveStore = useLeaveStoreInternal;
