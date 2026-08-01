/**
 * MSW handlers for the employee module.
 */
import { apiConfig } from '@core/config/api';
import type { Employee } from '@modules/employee/types';
import { http, HttpResponse } from 'msw';

import type { PaginatedResponse } from '@/types';

const BASE = apiConfig.baseUrl;

const mockEmployee: Employee = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  fullName: 'Jane Smith',
  email: 'jane.smith@company.com',
  jobTitle: 'Senior Engineer',
  department: { id: 'dept-1', name: 'Engineering' },
  status: 'active',
  contractType: 'full_time',
  hireDate: '2021-03-15',
  createdAt: '2021-03-15T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockPage: PaginatedResponse<Employee> = {
  data: [mockEmployee],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const employeeHandlers = [
  http.get(`${BASE}/employees`, () => {
    return HttpResponse.json(mockPage);
  }),

  http.get(`${BASE}/employees/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockEmployee, id: params['id'] });
  }),

  http.post(`${BASE}/employees`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      {
        ...mockEmployee,
        id: 'new-1',
        firstName: body['firstName'] as string,
        lastName: body['lastName'] as string,
        email: body['email'] as string,
      },
      { status: 201 },
    );
  }),

  http.patch(`${BASE}/employees/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ...mockEmployee, id: params['id'], ...body });
  }),

  http.delete(`${BASE}/employees/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
