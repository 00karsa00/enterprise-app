/**
 * Employee form validators using Zod.
 *
 * WHY: Centralizes all validation logic for employee forms.
 * Each schema exports both the schema and the inferred TypeScript type.
 *
 * PATTERN: Schema-first validation. Infer types from schemas, not the reverse.
 */
import { z } from 'zod';

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  jobTitle: z
    .string()
    .min(1, 'Job title is required')
    .max(100, 'Job title must not exceed 100 characters')
    .trim(),
  departmentId: z.string().min(1, 'Department is required'),
  managerId: z.string().optional(),
  contractType: z.enum(['full_time', 'part_time', 'contractor', 'intern'], {
    required_error: 'Contract type is required',
  }),
  hireDate: z
    .string()
    .min(1, 'Hire date is required')
    .regex(isoDateRegex, 'Date must be in YYYY-MM-DD format'),
  salary: z
    .number()
    .positive('Salary must be a positive number')
    .optional()
    .nullable(),
  currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
  location: z.string().max(100).optional(),
  gender: z
    .enum(['male', 'female', 'other', 'prefer_not_to_say'])
    .optional(),
  skills: z.array(z.string()).optional(),
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema
  .partial()
  .extend({
    status: z
      .enum(['active', 'inactive', 'on_leave', 'terminated'])
      .optional(),
    terminationDate: z
      .string()
      .regex(isoDateRegex, 'Date must be in YYYY-MM-DD format')
      .optional(),
  });

export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

export const employeeFilterSchema = z.object({
  search: z.string().optional(),
  departmentId: z.string().optional(),
  status: z
    .enum(['active', 'inactive', 'on_leave', 'terminated'])
    .optional(),
  contractType: z
    .enum(['full_time', 'part_time', 'contractor', 'intern'])
    .optional(),
});

export type EmployeeFilterFormData = z.infer<typeof employeeFilterSchema>;
