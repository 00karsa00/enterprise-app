/**
 * usePermissions — React hook for permission checks.
 * Feature modules use this, never accessing authService directly.
 */
import { useCallback } from 'react';

import type { Permission } from '@core/config/permissions';
import { authService } from '@infrastructure/auth/AuthFactory';

export interface UsePermissionsReturn {
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: string) => boolean;
  currentUser: ReturnType<typeof authService.getCurrentUser>;
}

export function usePermissions(): UsePermissionsReturn {
  const hasPermission = useCallback(
    (permission: Permission) => authService.hasPermission(permission),
    [],
  );

  const hasAllPermissions = useCallback(
    (permissions: Permission[]) =>
      permissions.every((p) => authService.hasPermission(p)),
    [],
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]) =>
      permissions.some((p) => authService.hasPermission(p)),
    [],
  );

  const hasRole = useCallback(
    (role: string) => authService.hasRole(role),
    [],
  );

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    currentUser: authService.getCurrentUser(),
  };
}
