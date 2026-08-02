/**
 * OrganisationService — business logic layer.
 * Never calls httpClient directly — delegates to repository.
 */
import { logger } from '@infrastructure/logger/LoggerFactory';
import { organisationRepository } from '../repository/OrganisationRepository';
import type {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../types/organisation.types';
import type { PaginatedResponse } from '@/types';

export class OrganisationService {
  // ── Companies ──────────────────────────────────────────────────────────────

  async getCompanies(page = 1, limit = 20): Promise<PaginatedResponse<Company>> {
    logger.debug('Fetching companies', { page, limit });
    return organisationRepository.getCompanies(page, limit);
  }

  async getCompany(id: string | number): Promise<Company> {
    return organisationRepository.getCompany(id);
  }

  async createCompany(data: CreateCompanyDto): Promise<Company> {
    logger.info('Creating company', { code: data.code });
    const company = await organisationRepository.createCompany(data);
    logger.info('Company created', { id: company.id });
    return company;
  }

  async updateCompany(id: string | number, data: UpdateCompanyDto): Promise<Company> {
    logger.info('Updating company', { id });
    return organisationRepository.updateCompany(id, data);
  }

  async deleteCompany(id: string | number): Promise<void> {
    logger.info('Deleting company', { id });
    return organisationRepository.deleteCompany(id);
  }

  // ── Departments ────────────────────────────────────────────────────────────

  async getDepartments(
    page = 1,
    limit = 20,
    companyId?: string | number,
  ): Promise<PaginatedResponse<Department>> {
    return organisationRepository.getDepartments(page, limit, companyId);
  }

  async getDepartment(id: string | number): Promise<Department> {
    return organisationRepository.getDepartment(id);
  }

  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    logger.info('Creating department', { code: data.code });
    const dept = await organisationRepository.createDepartment(data);
    logger.info('Department created', { id: dept.id });
    return dept;
  }

  async updateDepartment(id: string | number, data: UpdateDepartmentDto): Promise<Department> {
    return organisationRepository.updateDepartment(id, data);
  }

  async deleteDepartment(id: string | number): Promise<void> {
    return organisationRepository.deleteDepartment(id);
  }
}

export const organisationService = new OrganisationService();
