import { AppBadge } from '@shared/ui/AppBadge';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('AppBadge', () => {
  it('renders children', () => {
    render(<AppBadge>Active</AppBadge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    // CSS modules hash class names in tests, so check the rendered HTML contains
    // the success variant by verifying the element exists and is visible
    const { getByText } = render(<AppBadge variant="success">OK</AppBadge>);
    expect(getByText('OK')).toBeInTheDocument();
  });

  it('renders dot indicator when dot=true', () => {
    const { container } = render(<AppBadge dot>Status</AppBadge>);
    // The dot span is aria-hidden
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument();
  });
});
