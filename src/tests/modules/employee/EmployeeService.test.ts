/**
 * EmployeeService unit tests — mocks the repository layer.
 * Tests pure business logic in isolation.
 */
import type { IEmployeeRepository } from '@modules/employee/repository/IEmployeeRepository';
import { EmployeeService } from '@modules/employee/services/EmployeeService';
import type { Employee } from '@modules/employee/types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { PaginatedResponse } from '@/types';

const mockEmployee: Employee = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  fullName: 'Jane Smith',
  email: 'jane@company.com',
  jobTitle: 'Engineer',
  department: { id: 'd1', name: 'Engineering' },
  status: 'active',
  contractType: 'full_time',
  hireDate: '2021-01-01',
  createdAt: '2021-01-01T00:00:00Z',
  updatedAt: '2021-01-01T00:00:00Z',
};

const mockRepo: IEmployeeRepository = {
  findAll: vi.fn().mockResolvedValue({
    data: [mockEmployee],
    total: 1,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  } satisfies PaginatedResponse<Employee>),
  findById: vi.fn().mockResolvedValue(mockEmployee),
  create: vi.fn().mockResolvedValue(mockEmployee),
  update: vi.fn().mockResolvedValue({ ...mockEmployee, jobTitle: 'Senior Engineer' }),
  delete: vi.fn().mockResolvedValue(undefined),
  export: vi.fn().mockResolvedValue(new Blob()),
};

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EmployeeService(mockRepo);
  });

  it('getEmployees calls repository.findAll', async () => {
    const result = await service.getEmployees({ page: 1, pageSize: 10 });
    expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    expect(result.data[0]).toEqual(mockEmployee);
  });

  it('getEmployee calls repository.findById', async () => {
    await service.getEmployee('1');
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });

  it('createEmployee calls repository.create and returns employee', async () => {
    const dto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@company.com',
      jobTitle: 'Engineer',
      departmentId: 'd1',
      contractType: 'full_time' as const,
      hireDate: '2021-01-01',
    };
    const result = await service.createEmployee(dto);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('1');
  });

  it('updateEmployee calls repository.update', async () => {
    const result = await service.updateEmployee('1', { jobTitle: 'Senior Engineer' });
    expect(mockRepo.update).toHaveBeenCalledWith('1', { jobTitle: 'Senior Engineer' });
    expect(result.jobTitle).toBe('Senior Engineer');
  });

  it('deleteEmployee calls repository.delete', async () => {
    await service.deleteEmployee('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('getDisplayName returns full name', () => {
    expect(service.getDisplayName(mockEmployee)).toBe('Jane Smith');
  });

  it('isActive returns true for active employee', () => {
    expect(service.isActive(mockEmployee)).toBe(true);
  });

  it('isActive returns false for inactive employee', () => {
    expect(service.isActive({ ...mockEmployee, status: 'terminated' })).toBe(false);
  });
});
