/**
 * API configuration constants.
 *
 * WHY: Single source of truth for all API endpoints and settings.
 * Changing the base URL or version here propagates everywhere.
 *
 * ALLOWED DEPENDENCIES: env config only
 * FORBIDDEN: axios, fetch, any HTTP library
 */
import { env } from './env';

export const apiConfig = {
  baseUrl: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT,
  retryAttempts: env.VITE_API_RETRY_ATTEMPTS,
  retryDelayMs: env.VITE_API_RETRY_DELAY_MS,
  version: 'v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  employees: {
    list: '/employees',
    byId: (id: string | number) => `/employees/${id}`,
    create: '/employees',
    update: (id: string | number) => `/employees/${id}`,
    delete: (id: string | number) => `/employees/${id}`,
    export: '/employees/export',
  },
  departments: {
    list: '/departments',
    byId: (id: string | number) => `/departments/${id}`,
  },
  roles: {
    list: '/roles',
  },
} as const;
