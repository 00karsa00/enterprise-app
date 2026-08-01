import type { Employee } from '@modules/employee/types';
import {
  getEmployeeInitials,
  formatEmployeeName,
  isEmployeeActive,
  getYearsOfService,
} from '@modules/employee/utils';
import { describe, it, expect } from 'vitest';

const base: Employee = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  fullName: 'Jane Smith',
  email: 'j@c.com',
  jobTitle: 'Engineer',
  department: { id: 'd1', name: 'Eng' },
  status: 'active',
  contractType: 'full_time',
  hireDate: new Date(Date.now() - 2 * 365.25 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  createdAt: '2022-01-01T00:00:00Z',
  updatedAt: '2022-01-01T00:00:00Z',
};

describe('getEmployeeInitials', () => {
  it('returns first letters of first and last name', () => {
    expect(getEmployeeInitials(base)).toBe('JS');
  });
});

describe('formatEmployeeName', () => {
  it('returns full name', () => {
    expect(formatEmployeeName(base)).toBe('Jane Smith');
  });
});

describe('isEmployeeActive', () => {
  it('returns true for active', () => {
    expect(isEmployeeActive(base)).toBe(true);
  });
  it('returns false for terminated', () => {
    expect(isEmployeeActive({ ...base, status: 'terminated' })).toBe(false);
  });
});

describe('getYearsOfService', () => {
  it('returns approximately 2 for 2-year-old hire date', () => {
    expect(getYearsOfService(base)).toBe(2);
  });
});
