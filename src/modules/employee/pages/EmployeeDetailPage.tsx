import { ROUTES, buildRoute } from '@core/config/routes';
import { AppBadge } from '@shared/ui/AppBadge';
import { AppButton } from '@shared/ui/AppButton';
import { AppCard } from '@shared/ui/AppCard';
import { AppLoader } from '@shared/ui/AppLoader';
import { useParams, useNavigate } from 'react-router-dom';

import { EmployeeStatusBadge } from '../components/EmployeeStatusBadge';
import { CONTRACT_TYPE_LABELS } from '../constants';
import { useEmployeeDetail } from '../hooks/useEmployeeDetail';


import styles from './EmployeeDetailPage.module.css';

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading, isError } = useEmployeeDetail(id ?? '');

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <AppLoader size="xl" label="Loading employee details..." />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className={styles.errorState}>
        <p>Employee not found.</p>
        <AppButton onClick={() => navigate(ROUTES.EMPLOYEES)}>
          Back to Employees
        </AppButton>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <button
          type="button"
          onClick={() => navigate(ROUTES.EMPLOYEES)}
          className={styles.backLink}
        >
          ← Employees
        </button>
        <span className={styles.breadcrumbSep}>/</span>
        <span>{employee.fullName}</span>
      </div>

      <AppCard
        title={employee.fullName}
        subtitle={employee.jobTitle}
        headerActions={
          <div className={styles.headerActions}>
            <EmployeeStatusBadge status={employee.status} />
            <AppButton
              size="sm"
              variant="secondary"
              onClick={() =>
                navigate(buildRoute(ROUTES.EMPLOYEE_EDIT, { id: employee.id }))
              }
            >
              Edit
            </AppButton>
          </div>
        }
      >
        <div className={styles.details}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <dl className={styles.dl}>
              <div className={styles.dlRow}>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${employee.email}`} className={styles.link}>
                    {employee.email}
                  </a>
                </dd>
              </div>
              {employee.phone && (
                <div className={styles.dlRow}>
                  <dt>Phone</dt>
                  <dd>{employee.phone}</dd>
                </div>
              )}
              {employee.location && (
                <div className={styles.dlRow}>
                  <dt>Location</dt>
                  <dd>{employee.location}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Employment Details</h3>
            <dl className={styles.dl}>
              <div className={styles.dlRow}>
                <dt>Department</dt>
                <dd>{employee.department.name}</dd>
              </div>
              <div className={styles.dlRow}>
                <dt>Contract Type</dt>
                <dd>
                  <AppBadge variant="info">
                    {CONTRACT_TYPE_LABELS[employee.contractType]}
                  </AppBadge>
                </dd>
              </div>
              <div className={styles.dlRow}>
                <dt>Hire Date</dt>
                <dd>
                  {new Date(employee.hireDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              {employee.manager && (
                <div className={styles.dlRow}>
                  <dt>Manager</dt>
                  <dd>{employee.manager.fullName}</dd>
                </div>
              )}
            </dl>
          </div>

          {employee.skills && employee.skills.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Skills</h3>
              <div className={styles.skills}>
                {employee.skills.map((skill) => (
                  <AppBadge key={skill} variant="default">
                    {skill}
                  </AppBadge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AppCard>
    </div>
  );
}
