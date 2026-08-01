import type { Employee } from '../types';

export function getEmployeeInitials(employee: Employee): string {
  return `${employee.firstName[0] ?? ''}${employee.lastName[0] ?? ''}`.toUpperCase();
}

export function formatEmployeeName(
  employee: Pick<Employee, 'firstName' | 'lastName'>,
): string {
  return `${employee.firstName} ${employee.lastName}`;
}

export function isEmployeeActive(employee: Employee): boolean {
  return employee.status === 'active';
}

export function getYearsOfService(employee: Employee): number {
  const hireDate = new Date(employee.hireDate);
  const now = new Date();
  return Math.floor(
    (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );
}
