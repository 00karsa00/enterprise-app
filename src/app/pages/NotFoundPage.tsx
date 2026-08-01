import { ROUTES } from '@core/config/routes';
import { AppButton } from '@shared/ui/AppButton';
import { useNavigate } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code} aria-hidden="true">404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <AppButton onClick={() => navigate(ROUTES.DASHBOARD)}>
          Back to Dashboard
        </AppButton>
      </div>
    </div>
  );
}
