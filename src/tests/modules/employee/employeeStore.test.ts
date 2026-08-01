/**
 * Employee store tests — validates domain API without exposing Zustand internals.
 */
import { useEmployeeStore } from '@modules/employee/store';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the service layer so store tests don't hit HTTP
vi.mock('@modules/employee/services/EmployeeService', () => ({
  employeeService: {
    getEmployees: vi.fn().mockResolvedValue({
      data: [{ id: '1', fullName: 'Test User', firstName: 'Test', lastName: 'User', email: 't@t.com', jobTitle: 'Dev', department: { id: 'd1', name: 'Eng' }, status: 'active', contractType: 'full_time', hireDate: '2022-01-01', createdAt: '2022-01-01T00:00:00Z', updatedAt: '2022-01-01T00:00:00Z' }],
      total: 1, page: 1, pageSize: 10, totalPages: 1, hasNextPage: false, hasPreviousPage: false,
    }),
    createEmployee: vi.fn().mockResolvedValue({ id: '2', fullName: 'New Employee', firstName: 'New', lastName: 'Employee' }),
    updateEmployee: vi.fn().mockResolvedValue({ id: '1', fullName: 'Updated', firstName: 'Updated', lastName: 'Employee' }),
    deleteEmployee: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock notify so tests don't fail on missing toast container
vi.mock('@infrastructure/notification/NotificationFactory', () => ({
  notify: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

describe('useEmployeeStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useEmployeeStore.setState({
      employees: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  });

  it('loadEmployees populates employees state', async () => {
    const { result } = renderHook(() => useEmployeeStore());
    await act(async () => { await result.current.loadEmployees(); });
    expect(result.current.employees).toHaveLength(1);
    expect(result.current.employees[0]?.fullName).toBe('Test User');
    expect(result.current.isLoading).toBe(false);
  });

  it('deleteEmployee removes employee from state', async () => {
    useEmployeeStore.setState({
      employees: [{ id: '1', fullName: 'Test', firstName: 'T', lastName: 'U', email: 't@t.com', jobTitle: 'Dev', department: { id: 'd1', name: 'Eng' }, status: 'active', contractType: 'full_time', hireDate: '2022-01-01', createdAt: '2022-01-01T00:00:00Z', updatedAt: '2022-01-01T00:00:00Z' }],
    });
    const { result } = renderHook(() => useEmployeeStore());
    await act(async () => { await result.current.deleteEmployee('1'); });
    expect(result.current.employees).toHaveLength(0);
  });

  it('clearError resets error state', () => {
    useEmployeeStore.setState({ error: 'Something failed' });
    const { result } = renderHook(() => useEmployeeStore());
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
