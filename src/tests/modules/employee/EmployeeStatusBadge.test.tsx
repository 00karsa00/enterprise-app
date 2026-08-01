import { EmployeeStatusBadge } from '@modules/employee/components/EmployeeStatusBadge';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('EmployeeStatusBadge', () => {
  it('renders "Active" label for active status', () => {
    render(<EmployeeStatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders "Terminated" label', () => {
    render(<EmployeeStatusBadge status="terminated" />);
    expect(screen.getByText('Terminated')).toBeInTheDocument();
  });

  it('renders "On Leave" label', () => {
    render(<EmployeeStatusBadge status="on_leave" />);
    expect(screen.getByText('On Leave')).toBeInTheDocument();
  });
});
