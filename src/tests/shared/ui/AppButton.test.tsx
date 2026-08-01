import { AppButton } from '@shared/ui/AppButton';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('AppButton', () => {
  it('renders children', () => {
    render(<AppButton>Click me</AppButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const onClick = vi.fn();
    render(<AppButton onClick={onClick}>Click</AppButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<AppButton disabled>Disabled</AppButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows aria-busy when loading', () => {
    render(<AppButton loading>Loading</AppButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  it('does not fire onClick when loading', () => {
    const onClick = vi.fn();
    render(<AppButton loading onClick={onClick}>Loading</AppButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has default type=button to prevent accidental form submission', () => {
    render(<AppButton>Button</AppButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
