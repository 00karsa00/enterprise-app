/**
 * Employee Repository integration test.
 * Uses MSW to mock the API layer.
 */
import { EmployeeRepository } from '@modules/employee/repository/EmployeeRepository';
import { describe, it, expect } from 'vitest';

describe('EmployeeRepository', () => {
  const repo = new EmployeeRepository();

  it('findAll returns paginated employees', async () => {
    const result = await repo.findAll({ page: 1, pageSize: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.data[0]).toMatchObject({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
    });
  });

  it('findById returns a single employee', async () => {
    const employee = await repo.findById('1');
    expect(employee.id).toBe('1');
    expect(employee.fullName).toBe('Jane Smith');
  });

  it('create returns new employee', async () => {
    const employee = await repo.create({
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob.jones@company.com',
      jobTitle: 'Designer',
      departmentId: 'dept-1',
      contractType: 'full_time',
      hireDate: '2024-01-01',
    });
    expect(employee.firstName).toBe('Bob');
    expect(employee.email).toBe('bob.jones@company.com');
  });

  it('delete resolves without error', async () => {
    await expect(repo.delete('1')).resolves.toBeUndefined();
  });
});
