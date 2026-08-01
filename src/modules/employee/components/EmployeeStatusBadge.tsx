import { memo } from 'react';

import { AppBadge } from '@shared/ui/AppBadge';
import type { BadgeVariant } from '@shared/ui/AppBadge';

import { EMPLOYEE_STATUS_LABELS, EMPLOYEE_STATUS_VARIANT } from '../constants';
import type { EmployeeStatus } from '../types';

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

export const EmployeeStatusBadge = memo(function EmployeeStatusBadge({
  status,
}: EmployeeStatusBadgeProps) {
  return (
    <AppBadge variant={EMPLOYEE_STATUS_VARIANT[status]} dot>
      {EMPLOYEE_STATUS_LABELS[status]}
    </AppBadge>
  );
});
