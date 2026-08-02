/**
 * DepartmentListPage — full CRUD list view for departments.
 */
import { useEffect, useState } from 'react';
import { useOrganisationStore } from '../store/organisationStore';
import type { Department, CreateDepartmentDto } from '../types/organisation.types';
import styles from './Organisation.module.css';

export function DepartmentListPage() {
  const {
    departments,
    companies,
    departmentPagination,
    isLoading,
    isSubmitting,
    loadDepartments,
    loadCompanies,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useOrganisationStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState<Partial<CreateDepartmentDto>>({});
  const [filterCompanyId, setFilterCompanyId] = useState<string>('');

  useEffect(() => {
    void loadCompanies();
    void loadDepartments();
  }, [loadCompanies, loadDepartments]);

  function handleCompanyFilter(id: string) {
    setFilterCompanyId(id);
    void loadDepartments(1, 20, id || undefined);
  }

  function openCreate() {
    setEditing(null);
    setForm({});
    setShowForm(true);
  }

  function openEdit(dept: Department) {
    setEditing(dept);
    setForm({
      name: dept.name,
      code: dept.code,
      companyId: dept.companyId,
      description: dept.description ?? '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateDepartment(editing.id, form);
    } else {
      await createDepartment(form as CreateDepartmentDto);
    }
    setShowForm(false);
  }

  async function handleDelete(id: string | number) {
    if (window.confirm('Delete this department?')) {
      await deleteDepartment(id);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Departments</h1>
          <p className={styles.subtitle}>{departmentPagination.total} departments</p>
        </div>
        <div className={styles.headerActions}>
          <select
            value={filterCompanyId}
            onChange={(e) => handleCompanyFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by company"
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={String(c.id)} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
          <button className={styles.btnPrimary} onClick={openCreate}>+ Add Department</button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr><td colSpan={5} className={styles.empty}>No departments found</td></tr>
              ) : (
                departments.map((d) => (
                  <tr key={String(d.id)}>
                    <td><strong>{d.name}</strong></td>
                    <td><code>{d.code}</code></td>
                    <td>{d.description ?? '—'}</td>
                    <td>
                      <span className={d.isActive ? styles.badgeActive : styles.badgeInactive}>
                        {d.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnSecondary} onClick={() => openEdit(d)}>Edit</button>
                        <button className={styles.btnDanger} onClick={() => void handleDelete(d.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={editing ? 'Edit Department' : 'Add Department'}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editing ? 'Edit Department' : 'Add Department'}</h2>
              <button className={styles.modalClose} onClick={() => setShowForm(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="dept-company">Company *</label>
                  <select
                    id="dept-company"
                    required
                    value={String(form.companyId ?? '')}
                    onChange={(e) => setForm({ ...form, companyId: Number(e.target.value) })}
                  >
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={String(c.id)} value={String(c.id)}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dept-name">Name *</label>
                  <input id="dept-name" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dept-code">Code *</label>
                  <input id="dept-code" required value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="dept-desc">Description</label>
                  <textarea id="dept-desc" rows={2} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
