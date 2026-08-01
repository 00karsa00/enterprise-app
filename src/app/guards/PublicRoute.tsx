/**
 * PublicRoute — redirects authenticated users away from public pages (e.g., login).
 */
import { ROUTES } from '@core/config/routes';
import { authService } from '@infrastructure/auth/AuthFactory';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  redirectTo?: string;
}

export function PublicRoute({ redirectTo = ROUTES.DASHBOARD }: PublicRouteProps) {
  if (authService.isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
