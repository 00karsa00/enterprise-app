/**
 * CompanyListPage — full CRUD list view for companies.
 */
import { useEffect, useState } from 'react';
import { useOrganisationStore } from '../store/organisationStore';
import type { Company, CreateCompanyDto } from '../types/organisation.types';
import styles from './Organisation.module.css';

export function CompanyListPage() {
  const {
    companies,
    companyPagination,
    isLoading,
    isSubmitting,
    loadCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
  } = useOrganisationStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<Partial<CreateCompanyDto>>({});

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  function openCreate() {
    setEditing(null);
    setForm({});
    setShowForm(true);
  }

  function openEdit(company: Company) {
    setEditing(company);
    setForm({
      name: company.name,
      legalName: company.legalName ?? '',
      code: company.code,
      industry: company.industry ?? '',
      email: company.email ?? '',
      phone: company.phone ?? '',
      website: company.website ?? '',
      city: company.city ?? '',
      state: company.state ?? '',
      country: company.country ?? 'India',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateCompany(editing.id, form);
    } else {
      await createCompany(form as CreateCompanyDto);
    }
    setShowForm(false);
  }

  async function handleDelete(id: string | number) {
    if (window.confirm('Delete this company? This will also remove all associated departments.')) {
      await deleteCompany(id);
    }
  }



  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Companies</h1>
          <p className={styles.subtitle}>{companyPagination.total} companies registered</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>
          + Add Company
        </button>
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
                <th>Industry</th>
                <th>Country</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>No companies found</td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={String(c.id)}>
                    <td>
                      <div className={styles.nameCell}>
                        <strong>{c.name}</strong>
                        {c.legalName && <small>{c.legalName}</small>}
                      </div>
                    </td>
                    <td><code>{c.code}</code></td>
                    <td>{c.industry ?? '—'}</td>
                    <td>{c.country ?? '—'}</td>
                    <td>
                      <span className={c.isActive ? styles.badgeActive : styles.badgeInactive}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnSecondary} onClick={() => openEdit(c)}>Edit</button>
                        <button className={styles.btnDanger} onClick={() => void handleDelete(c.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={editing ? 'Edit Company' : 'Add Company'}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editing ? 'Edit Company' : 'Add Company'}</h2>
              <button className={styles.modalClose} onClick={() => setShowForm(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="co-name">Company Name *</label>
                  <input id="co-name" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="co-code">Code *</label>
                  <input id="co-code" required value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} disabled={!!editing} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="co-legal">Legal Name</label>
                  <input id="co-legal" value={form.legalName ?? ''} onChange={(e) => setForm({ ...form, legalName: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="co-industry">Industry</label>
                  <input id="co-industry" value={form.industry ?? ''} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="co-email">Email</label>
                  <input id="co-email" type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="co-phone">Phone</label>
                  <input id="co-phone" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="co-city">City</label>
                  <input id="co-city" value={form.city ?? ''} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="co-country">Country</label>
                  <input id="co-country" value={form.country ?? 'India'} onChange={(e) => setForm({ ...form, country: e.target.value })} />
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
