import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@modules/auth/validators';
import { describe, it, expect } from 'vitest';

describe('loginSchema', () => {
  const valid = { email: 'user@company.com', password: 'Password1', rememberMe: false };

  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email', () => {
    const r = loginSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.path).toContain('email');
  });

  it('rejects short password', () => {
    const r = loginSchema.safeParse({ ...valid, password: 'short' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.path).toContain('password');
  });

  it('lowercases email', () => {
    const r = loginSchema.safeParse({ ...valid, email: 'USER@COMPANY.COM' });
    if (r.success) expect(r.data.email).toBe('user@company.com');
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
  });

  it('rejects missing email', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  const valid = {
    password: 'NewPass1',
    confirmPassword: 'NewPass1',
    token: 'abc123',
  };

  it('accepts matching passwords', () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const r = resetPasswordSchema.safeParse({ ...valid, confirmPassword: 'Different1' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toContain('match');
    }
  });

  it('rejects weak password (no uppercase)', () => {
    const r = resetPasswordSchema.safeParse({ ...valid, password: 'newpass1', confirmPassword: 'newpass1' });
    expect(r.success).toBe(false);
  });
});
