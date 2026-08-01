/**
 * AppLayout — the main application shell.
 * Includes sidebar, header, and main content area.
 */
import { memo, type ReactNode } from 'react';

import { ROUTES } from '@core/config/routes';
import { authService } from '@infrastructure/auth/AuthFactory';
import { AppButton } from '@shared/ui/AppButton';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: '⊞' },
  { to: ROUTES.EMPLOYEES, label: 'Employees', icon: '👥' },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: '⚙️' },
] as const;

export const AppLayout = memo(function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  async function handleLogout() {
    await authService.logout();
    void navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar} aria-label="Main navigation">
        <div className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden="true">⬡</span>
          <span className={styles.brandName}>Enterprise</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : '']
                  .filter(Boolean)
                  .join(' ')
              }
              aria-label={label}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {icon}
              </span>
              <span className={styles.navLabel}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar} aria-hidden="true">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className={styles.userText}>
                <p className={styles.userName}>
                  {user.firstName} {user.lastName}
                </p>
                <p className={styles.userEmail}>{user.email}</p>
              </div>
            </div>
          )}
          <AppButton
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            fullWidth
          >
            Sign Out
          </AppButton>
        </div>
      </aside>

      <div className={styles.main}>
        <main className={styles.content} id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
});
