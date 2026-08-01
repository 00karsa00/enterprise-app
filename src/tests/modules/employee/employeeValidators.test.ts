import { createEmployeeSchema } from '@modules/employee/validators';
import { describe, it, expect } from 'vitest';

describe('createEmployeeSchema', () => {
  const valid = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    jobTitle: 'Engineer',
    departmentId: 'dept-1',
    contractType: 'full_time' as const,
    hireDate: '2024-01-15',
  };

  it('accepts valid data', () => {
    const result = createEmployeeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = createEmployeeSchema.safeParse({
      ...valid,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('email');
    }
  });

  it('rejects short first name', () => {
    const result = createEmployeeSchema.safeParse({ ...valid, firstName: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const { firstName: _, ...missing } = valid;
    const result = createEmployeeSchema.safeParse(missing);
    expect(result.success).toBe(false);
  });

  it('rejects invalid contract type', () => {
    const result = createEmployeeSchema.safeParse({
      ...valid,
      contractType: 'invalid_type',
    });
    expect(result.success).toBe(false);
  });
});
