import { apiConfig } from '@core/config/api';
import { http, HttpResponse } from 'msw';

const BASE = apiConfig.baseUrl;

export const authHandlers = [
  http.post(`${BASE}/auth/login`, () => {
    return HttpResponse.json({
      user: {
        id: 'user-1',
        email: 'admin@company.com',
        firstName: 'Admin',
        lastName: 'User',
        roles: ['admin'],
        permissions: ['employee:read', 'employee:create', 'employee:update', 'employee:delete'],
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
        tokenType: 'Bearer',
      },
    });
  }),

  http.post(`${BASE}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE}/auth/me`, () => {
    return HttpResponse.json({
      id: 'user-1',
      email: 'admin@company.com',
      firstName: 'Admin',
      lastName: 'User',
      roles: ['admin'],
      permissions: ['employee:read'],
    });
  }),
];
