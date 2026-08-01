/**
 * Employee module routes — lazy loaded for code splitting.
 *
 * WHY: Each module owns its routes. The app router simply includes these.
 * A module can be dropped into another project with its routes intact.
 */
import { lazy, Suspense } from 'react';

import { AppLoader } from '@shared/ui/AppLoader';
import { Route, Routes } from 'react-router-dom';

const EmployeeListPage = lazy(() =>
  import('../pages/EmployeeListPage').then((m) => ({
    default: m.EmployeeListPage,
  })),
);

const EmployeeDetailPage = lazy(() =>
  import('../pages/EmployeeDetailPage').then((m) => ({
    default: m.EmployeeDetailPage,
  })),
);

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
    <AppLoader size="lg" />
  </div>
);

export function EmployeeRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<EmployeeListPage />} />
        <Route path=":id" element={<EmployeeDetailPage />} />
      </Routes>
    </Suspense>
  );
}
