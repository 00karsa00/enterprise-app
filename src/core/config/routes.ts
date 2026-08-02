/**
 * Route constants — never hardcode route strings in components.
 *
 * WHY: Centralizes all routing strings. Renaming a route only requires
 * changing it here. Components always import from this file.
 *
 * BEST PRACTICE: Use the `buildRoute` helper to construct dynamic segments.
 */

export const ROUTES = {
  // Public
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  NOT_FOUND: '/404',
  MAINTENANCE: '/maintenance',

  // App root
  ROOT: '/',
  DASHBOARD: '/dashboard',

  // Employee module
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',
  EMPLOYEE_CREATE: '/employees/create',
  EMPLOYEE_EDIT: '/employees/:id/edit',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',

  // Organisation module
  COMPANIES: '/organisations/companies',
  DEPARTMENTS: '/organisations/departments',

  // Leave module
  LEAVE_TYPES: '/leave/types',
  LEAVE_REQUESTS: '/leave/requests',
  LEAVE_BALANCES: '/leave/balances',

  // AI module
  AI_ANALYTICS: '/ai/analytics',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

/**
 * Build a route path by replacing named parameters.
 *
 * @example
 * buildRoute(ROUTES.EMPLOYEE_DETAIL, { id: '123' })
 * // returns '/employees/123'
 */
export function buildRoute(
  route: string,
  params: Record<string, string | number> = {},
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, String(value)),
    route,
  );
}
