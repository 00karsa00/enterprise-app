/**
 * PermissionGuard — renders children only if user has required permission.
 * Use for conditional UI rendering, not route protection.
 *
 * For route-level permission: use ProtectedRoute with permission prop.
 */
import type { ReactNode } from 'react';

import type { Permission } from '@core/config/permissions';
import { authService } from '@infrastructure/auth/AuthFactory';

interface PermissionGuardProps {
  permission: Permission | Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const permissions = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? permissions.every((p) => authService.hasPermission(p))
    : permissions.some((p) => authService.hasPermission(p));

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
