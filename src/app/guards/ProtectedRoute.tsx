/**
 * ProtectedRoute — redirects unauthenticated users to login.
 *
 * PATTERN: Route Guard. Place around any routes that require authentication.
 * Feature modules never implement their own auth checks.
 */
import { ROUTES } from '@core/config/routes';
import { authService } from '@infrastructure/auth/AuthFactory';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const location = useLocation();
console.log('authService.isAuthenticated() => ', authService.isAuthenticated())
  if (!authService.isAuthenticated()) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
