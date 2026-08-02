import { apiConfig } from '@core/config/api';
import { http, HttpResponse } from 'msw';

const BASE = apiConfig.baseUrl;

export const authHandlers = [
  http.post(`${BASE}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'mock-access-token',
        expiresIn: 900,
        tokenType: 'Bearer',
        admin: {
          id: 1,
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@techcorp.in',
          role: 'super_admin',
          isActive: true,
          lastLoginAt: new Date().toISOString(),
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  }),

  http.post(`${BASE}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE}/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 1,
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@techcorp.in',
        role: 'super_admin',
        isActive: true,
        lastLoginAt: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  }),
];
