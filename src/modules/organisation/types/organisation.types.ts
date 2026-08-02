/**
 * Organisation module domain types — Company & Department.
 */
import type { ID, ISODateString } from '@/types';

// ─── Company ─────────────────────────────────────────────────────────────────

export interface Company {
  id: ID;
  name: string;
  legalName?: string | null;
  code: string;
  industry?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string;
  pincode?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateCompanyDto {
  name: string;
  legalName?: string;
  code: string;
  industry?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  logoUrl?: string;
}

export type UpdateCompanyDto = Partial<CreateCompanyDto> & { isActive?: boolean };

// ─── Department ───────────────────────────────────────────────────────────────

export interface Department {
  id: ID;
  companyId: ID;
  name: string;
  code: string;
  description?: string | null;
  headId?: ID | null;
  parentId?: ID | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateDepartmentDto {
  companyId: ID;
  name: string;
  code: string;
  description?: string;
  headId?: ID;
  parentId?: ID;
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto> & { isActive?: boolean };

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface OrganisationFilters {
  page?: number;
  limit?: number;
  companyId?: ID;
}
