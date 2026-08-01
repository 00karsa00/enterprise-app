/**
 * Auth module routes — lazy loaded, owned by the auth module.
 *
 * WHY: Each module owns its routes. The app router simply mounts this.
 * Adding a new auth page only requires editing this file.
 */
import { lazy, Suspense } from 'react';

import { AppLoader } from '@shared/ui/AppLoader';
import { Route, Routes } from 'react-router-dom';

const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);

const ForgotPasswordPage = lazy(() =>
  import('../pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);

const ResetPasswordPage = lazy(() =>
  import('../pages/ResetPasswordPage').then((m) => ({
    default: m.ResetPasswordPage,
  })),
);

function AuthFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AppLoader size="lg" />
    </div>
  );
}

export function AuthRoutes() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Suspense>
  );
}
