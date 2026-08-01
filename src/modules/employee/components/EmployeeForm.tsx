/**
 * EmployeeForm — create/edit employee form component.
 *
 * Uses shared form abstractions. Never imports react-hook-form or zod directly.
 */
import { memo } from 'react';

import { AppForm } from '@shared/form/AppForm';
import { AppSelectField } from '@shared/form/AppSelectField';
import { AppTextField } from '@shared/form/AppTextField';
import { AppButton } from '@shared/ui/AppButton';

import type { Employee } from '../types';
import {
  createEmployeeSchema,
  type CreateEmployeeFormData,
} from '../validators';

import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  defaultValues?: Partial<CreateEmployeeFormData>;
  onSubmit: (data: CreateEmployeeFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  employee?: Employee;
}

const CONTRACT_OPTIONS = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'intern', label: 'Intern' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const EmployeeForm = memo(function EmployeeForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  onCancel,
  submitLabel = 'Save Employee',
}: EmployeeFormProps) {
  return (
    <AppForm<CreateEmployeeFormData>
      schema={createEmployeeSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    >
      <div className={styles.grid}>
        <AppTextField
          name="firstName"
          label="First Name"
          placeholder="John"
          required
          autoComplete="given-name"
        />
        <AppTextField
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
          autoComplete="family-name"
        />
        <AppTextField
          name="email"
          label="Email Address"
          type="email"
          placeholder="john.doe@company.com"
          required
          autoComplete="email"
          className={styles.fullWidth}
        />
        <AppTextField
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
        />
        <AppTextField
          name="jobTitle"
          label="Job Title"
          placeholder="Software Engineer"
          required
          className={styles.fullWidth}
        />
        <AppTextField
          name="departmentId"
          label="Department ID"
          placeholder="dept-001"
          required
        />
        <AppSelectField
          name="contractType"
          label="Contract Type"
          options={CONTRACT_OPTIONS}
          required
        />
        <AppTextField
          name="hireDate"
          label="Hire Date"
          type="date"
          required
        />
        <AppSelectField
          name="gender"
          label="Gender"
          options={GENDER_OPTIONS}
        />
        <AppTextField
          name="location"
          label="Location"
          placeholder="New York, NY"
        />
        <AppTextField
          name="salary"
          label="Salary"
          type="number"
          placeholder="75000"
        />
        <AppTextField
          name="currency"
          label="Currency"
          placeholder="USD"
          maxLength={3}
        />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <AppButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </AppButton>
        )}
        <AppButton type="submit" loading={isLoading}>
          {submitLabel}
        </AppButton>
      </div>
    </AppForm>
  );
});
