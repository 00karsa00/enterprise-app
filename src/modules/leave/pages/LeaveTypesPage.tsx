/**
 * LeaveTypesPage — full CRUD for leave types.
 */
import { useEffect, useState } from 'react';
import { useLeaveStore } from '../store/leaveStore';
import type { LeaveType, CreateLeaveTypeDto } from '../types/leave.types';
import styles from '../../organisation/pages/Organisation.module.css';

export function LeaveTypesPage() {
  const {
    leaveTypes,
    isLoading,
    isSubmitting,
    loadLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
  } = useLeaveStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LeaveType | null>(null);
  const [form, setForm] = useState<Partial<CreateLeaveTypeDto>>({});

  useEffect(() => { void loadLeaveTypes(); }, [loadLeaveTypes]);

  function openCreate() {
    setEditing(null);
    setForm({ daysAllowed: 0, carryForward: false, requiresApproval: true, isPaid: true });
    setShowForm(true);
  }

  function openEdit(lt: LeaveType) {
    setEditing(lt);
    setForm({
      name: lt.name,
      code: lt.code,
      companyId: lt.companyId,
      description: lt.description ?? '',
      daysAllowed: lt.daysAllowed,
      carryForward: lt.carryForward,
      maxCarryForward: lt.maxCarryForward,
      requiresApproval: lt.requiresApproval,
      isPaid: lt.isPaid,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateLeaveType(editing.id, form);
    } else {
      await createLeaveType(form as CreateLeaveTypeDto);
    }
    setShowForm(false);
  }

  async function handleDelete(id: string | number) {
    if (window.confirm('Delete this leave type?')) {
      await deleteLeaveType(id);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Leave Types</h1>
          <p className={styles.subtitle}>{leaveTypes.length} types configured</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>+ Add Leave Type</button>
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
                <th>Days Allowed</th>
                <th>Carry Forward</th>
                <th>Paid</th>
                <th>Approval</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.length === 0 ? (
                <tr><td colSpan={8} className={styles.empty}>No leave types configured</td></tr>
              ) : (
                leaveTypes.map((lt) => (
                  <tr key={String(lt.id)}>
                    <td><strong>{lt.name}</strong></td>
                    <td><code>{lt.code}</code></td>
                    <td>{lt.daysAllowed}</td>
                    <td>{lt.carryForward ? `Yes (max ${lt.maxCarryForward})` : 'No'}</td>
                    <td>{lt.isPaid ? 'Paid' : 'Unpaid'}</td>
                    <td>{lt.requiresApproval ? 'Required' : 'Auto'}</td>
                    <td>
                      <span className={lt.isActive ? styles.badgeActive : styles.badgeInactive}>
                        {lt.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnSecondary} onClick={() => openEdit(lt)}>Edit</button>
                        <button className={styles.btnDanger} onClick={() => void handleDelete(lt.id)}>Delete</button>
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
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editing ? 'Edit Leave Type' : 'Add Leave Type'}</h2>
              <button className={styles.modalClose} onClick={() => setShowForm(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="lt-name">Name *</label>
                  <input id="lt-name" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lt-code">Code *</label>
                  <input id="lt-code" required value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} disabled={!!editing} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lt-days">Days Allowed *</label>
                  <input id="lt-days" type="number" min={0} required value={form.daysAllowed ?? 0} onChange={(e) => setForm({ ...form, daysAllowed: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lt-maxcf">Max Carry Forward</label>
                  <input id="lt-maxcf" type="number" min={0} value={form.maxCarryForward ?? 0} onChange={(e) => setForm({ ...form, maxCarryForward: Number(e.target.value) })} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="lt-desc">Description</label>
                  <textarea id="lt-desc" rows={2} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input type="checkbox" checked={!!form.carryForward} onChange={(e) => setForm({ ...form, carryForward: e.target.checked })} />
                    {' '}Carry Forward
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input type="checkbox" checked={!!form.isPaid} onChange={(e) => setForm({ ...form, isPaid: e.target.checked })} />
                    {' '}Paid Leave
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input type="checkbox" checked={!!form.requiresApproval} onChange={(e) => setForm({ ...form, requiresApproval: e.target.checked })} />
                    {' '}Requires Approval
                  </label>
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
