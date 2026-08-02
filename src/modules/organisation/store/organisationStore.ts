/**
 * Organisation Store — Zustand state for companies & departments.
 * ⚠️ ONLY THIS FILE imports Zustand in the organisation module.
 */
import { logger } from '@infrastructure/logger/LoggerFactory';
import { notify } from '@infrastructure/notification/NotificationFactory';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { organisationService } from '../services/OrganisationService';
import type {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../types/organisation.types';
import type { PaginatedResponse } from '@/types';

interface OrganisationStoreState {
  // Companies
  companies: Company[];
  selectedCompany: Company | null;
  companyPagination: { total: number; page: number; limit: number; totalPages: number };

  // Departments
  departments: Department[];
  selectedDepartment: Department | null;
  departmentPagination: { total: number; page: number; limit: number; totalPages: number };

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Company actions
  loadCompanies: (page?: number, limit?: number) => Promise<void>;
  loadCompany: (id: string | number) => Promise<void>;
  createCompany: (data: CreateCompanyDto) => Promise<Company | null>;
  updateCompany: (id: string | number, data: UpdateCompanyDto) => Promise<Company | null>;
  deleteCompany: (id: string | number) => Promise<boolean>;
  selectCompany: (company: Company | null) => void;

  // Department actions
  loadDepartments: (page?: number, limit?: number, companyId?: string | number) => Promise<void>;
  loadDepartment: (id: string | number) => Promise<void>;
  createDepartment: (data: CreateDepartmentDto) => Promise<Department | null>;
  updateDepartment: (id: string | number, data: UpdateDepartmentDto) => Promise<Department | null>;
  deleteDepartment: (id: string | number) => Promise<boolean>;
  selectDepartment: (department: Department | null) => void;

  clearError: () => void;
}

const defaultPagination = { total: 0, page: 1, limit: 20, totalPages: 0 };

const useOrganisationStoreInternal = create<OrganisationStoreState>()(
  devtools(
    (set) => ({
      companies: [],
      selectedCompany: null,
      companyPagination: defaultPagination,
      departments: [],
      selectedDepartment: null,
      departmentPagination: defaultPagination,
      isLoading: false,
      isSubmitting: false,
      error: null,

      // ── Companies ──────────────────────────────────────────────────────────
      loadCompanies: async (page = 1, limit = 20) => {
        set({ isLoading: true, error: null });
        try {
          const apiResult = await organisationService.getCompanies(page, limit);
          const result = apiResult;
          set({
            companies: result.items,
            companyPagination: { total: result.total, page: result.page, limit: result.pageSize, totalPages: result.totalPages },
            isLoading: false,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load companies';
          logger.error('Failed to load companies', err);
          set({ error: msg, isLoading: false });
          notify.error(msg);
        }
      },

      loadCompany: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const company = await organisationService.getCompany(id);
          set({ selectedCompany: company, isLoading: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load company';
          set({ error: msg, isLoading: false });
        }
      },

      createCompany: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const company = await organisationService.createCompany(data);
          set((state) => ({ companies: [company, ...state.companies], isSubmitting: false }));
          notify.success(`Company "${company.name}" created`);
          return company;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to create company';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      updateCompany: async (id, data) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await organisationService.updateCompany(id, data);
          set((state) => ({
            companies: state.companies.map((c) => (c.id === id ? updated : c)),
            selectedCompany: state.selectedCompany?.id === id ? updated : state.selectedCompany,
            isSubmitting: false,
          }));
          notify.success('Company updated');
          return updated;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to update company';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      deleteCompany: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await organisationService.deleteCompany(id);
          set((state) => ({
            companies: state.companies.filter((c) => c.id !== id),
            selectedCompany: state.selectedCompany?.id === id ? null : state.selectedCompany,
            isSubmitting: false,
          }));
          notify.success('Company deleted');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to delete company';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      selectCompany: (company) => set({ selectedCompany: company }),

      // ── Departments ────────────────────────────────────────────────────────
      loadDepartments: async (page = 1, limit = 20, companyId) => {
        set({ isLoading: true, error: null });
        try {
          const result = await organisationService.getDepartments(page, limit, companyId);
          set({
            departments: result.items,
            departmentPagination: { total: result.total, page: result.page, limit: result.pageSize, totalPages: result.totalPages },
            isLoading: false,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load departments';
          set({ error: msg, isLoading: false });
          notify.error(msg);
        }
      },

      loadDepartment: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const dept = await organisationService.getDepartment(id);
          set({ selectedDepartment: dept, isLoading: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load department';
          set({ error: msg, isLoading: false });
        }
      },

      createDepartment: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const dept = await organisationService.createDepartment(data);
          set((state) => ({ departments: [dept, ...state.departments], isSubmitting: false }));
          notify.success(`Department "${dept.name}" created`);
          return dept;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to create department';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      updateDepartment: async (id, data) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await organisationService.updateDepartment(id, data);
          set((state) => ({
            departments: state.departments.map((d) => (d.id === id ? updated : d)),
            selectedDepartment: state.selectedDepartment?.id === id ? updated : state.selectedDepartment,
            isSubmitting: false,
          }));
          notify.success('Department updated');
          return updated;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to update department';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      deleteDepartment: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await organisationService.deleteDepartment(id);
          set((state) => ({
            departments: state.departments.filter((d) => d.id !== id),
            selectedDepartment: state.selectedDepartment?.id === id ? null : state.selectedDepartment,
            isSubmitting: false,
          }));
          notify.success('Department deleted');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to delete department';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      selectDepartment: (dept) => set({ selectedDepartment: dept }),
      clearError: () => set({ error: null }),
    }),
    { name: 'organisation-store' },
  ),
);

export const useOrganisationStore = useOrganisationStoreInternal;
