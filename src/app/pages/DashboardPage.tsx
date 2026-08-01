import { env } from '@core/config/env';
import { AppBadge } from '@shared/ui/AppBadge';
import { AppCard } from '@shared/ui/AppCard';

import styles from './DashboardPage.module.css';

export function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <AppBadge variant="primary">{env.VITE_APP_VERSION}</AppBadge>
      </div>

      <div className={styles.grid}>
        <AppCard title="Total Employees" shadow="sm">
          <p className={styles.statNumber}>—</p>
          <p className={styles.statLabel}>Across all departments</p>
        </AppCard>
        <AppCard title="Active" shadow="sm">
          <p className={styles.statNumber}>—</p>
          <p className={styles.statLabel}>Currently employed</p>
        </AppCard>
        <AppCard title="On Leave" shadow="sm">
          <p className={styles.statNumber}>—</p>
          <p className={styles.statLabel}>This month</p>
        </AppCard>
        <AppCard title="New Hires" shadow="sm">
          <p className={styles.statNumber}>—</p>
          <p className={styles.statLabel}>Last 30 days</p>
        </AppCard>
      </div>

      <AppCard title="Welcome to Enterprise App" subtitle="Built with Clean Architecture + DDD">
        <div className={styles.archNote}>
          <p>
            This application follows enterprise-grade patterns:
          </p>
          <ul>
            <li>Clean Architecture with strict layer separation</li>
            <li>Domain Driven Design (DDD) per feature module</li>
            <li>All third-party libraries hidden behind abstractions</li>
            <li>Swap Axios ↔ Fetch, Zustand ↔ Redux, Sonner ↔ Toastify with one file change</li>
          </ul>
        </div>
      </AppCard>
    </div>
  );
}
