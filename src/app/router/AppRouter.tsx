/**
 * AppRouter — the application route tree.
 *
 * WHY: All routing is defined here in one place.
 * Feature modules register their routes via their own lazy-loaded route components.
 * Route strings are never hardcoded — always use ROUTES constants.
 *
 * DEPENDENCY FLOW:
 *   AppRouter → module routes (lazy) → pages → hooks → services → infrastructure
 */
import { lazy, Suspense } from 'react';

import { ROUTES } from '@core/config/routes';
import { AppLoader } from '@shared/ui/AppLoader';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '../guards/ProtectedRoute';
import { PublicRoute } from '../guards/PublicRoute';
import { AppLayout } from '../layout/AppLayout';

// ─── Lazy loaded module routes ────────────────────────────────────────────────
const LoginPage = lazy(() =>
  import('@modules/auth/pages/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
);

const ForgotPasswordPage = lazy(() =>
  import('@modules/auth/pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);

const ResetPasswordPage = lazy(() =>
  import('@modules/auth/pages/ResetPasswordPage').then((m) => ({
    default: m.ResetPasswordPage,
  })),
);

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);

const EmployeeListPage = lazy(() =>
  import('@modules/employee/pages/EmployeeListPage').then((m) => ({
    default: m.EmployeeListPage,
  })),
);

const EmployeeDetailPage = lazy(() =>
  import('@modules/employee/pages/EmployeeDetailPage').then((m) => ({
    default: m.EmployeeDetailPage,
  })),
);

// Organisation module
const CompanyListPage = lazy(() =>
  import('@modules/organisation/pages/CompanyListPage').then((m) => ({
    default: m.CompanyListPage,
  })),
);

const DepartmentListPage = lazy(() =>
  import('@modules/organisation/pages/DepartmentListPage').then((m) => ({
    default: m.DepartmentListPage,
  })),
);

// Leave module
const LeaveTypesPage = lazy(() =>
  import('@modules/leave/pages/LeaveTypesPage').then((m) => ({
    default: m.LeaveTypesPage,
  })),
);

const LeaveRequestsPage = lazy(() =>
  import('@modules/leave/pages/LeaveRequestsPage').then((m) => ({
    default: m.LeaveRequestsPage,
  })),
);

const LeaveBalancesPage = lazy(() =>
  import('@modules/leave/pages/LeaveBalancesPage').then((m) => ({
    default: m.LeaveBalancesPage,
  })),
);

// AI module
const AiAnalyticsPage = lazy(() =>
  import('@modules/ai/pages/AiAnalyticsPage').then((m) => ({
    default: m.AiAnalyticsPage,
  })),
);

const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

// ─── Loading fallback ─────────────────────────────────────────────────────────
function FullPageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      }}
    >
      <AppLoader size="xl" />
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export function AppRouter() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        {/* ── Public routes (redirect to dashboard if authenticated) ── */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route
            path={ROUTES.RESET_PASSWORD}
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* ── Protected routes (redirect to login if not authenticated) ── */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={
              <AppLayout>
                {/* The Outlet rendered by ProtectedRoute is inside AppLayout */}
                <Suspense fallback={<AppLoader size="lg" overlay />}>
                  <Routes>
                    <Route
                      index
                      element={<Navigate to={ROUTES.DASHBOARD} replace />}
                    />
                    <Route
                      path={ROUTES.DASHBOARD}
                      element={<DashboardPage />}
                    />

                    {/* Employee module */}
                    <Route
                      path={ROUTES.EMPLOYEES}
                      element={<EmployeeListPage />}
                    />
                    <Route
                      path={ROUTES.EMPLOYEE_DETAIL}
                      element={<EmployeeDetailPage />}
                    />

                    {/* Organisation module */}
                    <Route path={ROUTES.COMPANIES} element={<CompanyListPage />} />
                    <Route path={ROUTES.DEPARTMENTS} element={<DepartmentListPage />} />

                    {/* Leave module */}
                    <Route path={ROUTES.LEAVE_TYPES} element={<LeaveTypesPage />} />
                    <Route path={ROUTES.LEAVE_REQUESTS} element={<LeaveRequestsPage />} />
                    <Route path={ROUTES.LEAVE_BALANCES} element={<LeaveBalancesPage />} />

                    {/* AI module */}
                    <Route path={ROUTES.AI_ANALYTICS} element={<AiAnalyticsPage />} />

                    {/* 404 within app */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </AppLayout>
            }
          />
        </Route>

        {/* ── Standalone 404 ── */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  );
}
