/**
 * Permission constants and helpers.
 *
 * WHY: Centralizes all permission strings to avoid magic strings scattered
 * across the codebase. Type-safe permission checking via TypeScript.
 *
 * PATTERN: Domain:Action format (e.g., 'employee:read')
 */

export const PERMISSIONS = {
  // Employee permissions
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_UPDATE: 'employee:update',
  EMPLOYEE_DELETE: 'employee:delete',
  EMPLOYEE_EXPORT: 'employee:export',

  // Department permissions
  DEPARTMENT_READ: 'department:read',
  DEPARTMENT_MANAGE: 'department:manage',

  // Admin permissions
  ADMIN_ACCESS: 'admin:access',
  USER_MANAGE: 'user:manage',
  ROLE_MANAGE: 'role:manage',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Default permissions per role.
 * This is the client-side representation — server always has final authority.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.DEPARTMENT_READ,
    PERMISSIONS.DEPARTMENT_MANAGE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_WRITE,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.DEPARTMENT_READ,
    PERMISSIONS.SETTINGS_READ,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.DEPARTMENT_READ,
    PERMISSIONS.SETTINGS_READ,
  ],
  [ROLES.VIEWER]: [PERMISSIONS.EMPLOYEE_READ, PERMISSIONS.DEPARTMENT_READ],
};

/**
 * Check if a set of user permissions satisfies a required permission.
 */
export function hasPermission(
  userPermissions: string[],
  required: Permission,
): boolean {
  return userPermissions.includes(required);
}

/**
 * Check if user has all of the required permissions.
 */
export function hasAllPermissions(
  userPermissions: string[],
  required: Permission[],
): boolean {
  return required.every((p) => userPermissions.includes(p));
}

/**
 * Check if user has at least one of the required permissions.
 */
export function hasAnyPermission(
  userPermissions: string[],
  required: Permission[],
): boolean {
  return required.some((p) => userPermissions.includes(p));
}
