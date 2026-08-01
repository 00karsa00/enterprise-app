/**
 * Employee domain types.
 *
 * WHY: All employee-related types live here. No third-party types leak in.
 * These are pure domain types — serializable, testable, portable.
 */
import type { ID, ISODateString, PaginationParams, SortParams } from '@/types';

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type EmployeeGender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type ContractType = 'full_time' | 'part_time' | 'contractor' | 'intern';

export interface Employee {
  id: ID;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  jobTitle: string;
  department: Department;
  manager?: EmployeeSummary;
  status: EmployeeStatus;
  gender?: EmployeeGender;
  contractType: ContractType;
  salary?: number;
  currency?: string;
  hireDate: ISODateString;
  terminationDate?: ISODateString;
  location?: string;
  timezone?: string;
  skills?: string[];
  metadata?: Record<string, unknown>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface EmployeeSummary {
  id: ID;
  fullName: string;
  email: string;
  jobTitle: string;
  avatarUrl?: string;
}

export interface Department {
  id: ID;
  name: string;
  code?: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  departmentId: ID;
  managerId?: ID;
  contractType: ContractType;
  hireDate: ISODateString;
  salary?: number;
  currency?: string;
  location?: string;
  gender?: EmployeeGender;
  skills?: string[];
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  status?: EmployeeStatus;
  terminationDate?: ISODateString;
}

export interface EmployeeFilters extends PaginationParams {
  search?: string;
  departmentId?: ID;
  status?: EmployeeStatus;
  contractType?: ContractType;
  managerId?: ID;
  sort?: SortParams;
}
