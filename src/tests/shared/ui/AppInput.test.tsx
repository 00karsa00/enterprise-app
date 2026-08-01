import { AppInput } from '@shared/ui/AppInput';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('AppInput', () => {
  it('renders with label', () => {
    render(<AppInput label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders error message with aria-invalid', () => {
    render(<AppInput label="Email" name="email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('renders hint text when no error', () => {
    render(<AppInput label="Name" name="name" hint="Enter your full name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('fires onChange', () => {
    const onChange = vi.fn();
    render(<AppInput label="Text" name="text" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Text'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('shows required asterisk', () => {
    render(<AppInput label="Field" name="field" required />);
    expect(screen.getByLabelText('required')).toBeInTheDocument();
  });
});
