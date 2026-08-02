/**
 * LeaveBalancesPage — view and manage employee leave balances.
 */
import { useEffect, useState } from 'react';
import { useLeaveStore } from '../store/leaveStore';
import type { CreateLeaveBalanceDto } from '../types/leave.types';
import styles from '../../organisation/pages/Organisation.module.css';

export function LeaveBalancesPage() {
  const {
    leaveBalances,
    leaveTypes,
    isLoading,
    isSubmitting,
    loadLeaveBalances,
    loadLeaveTypes,
    createLeaveBalance,
    updateLeaveBalance,
    deleteLeaveBalance,
  } = useLeaveStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<CreateLeaveBalanceDto>>({ year: new Date().getFullYear() });
  const [filterEmployeeId, setFilterEmployeeId] = useState('');

  useEffect(() => {
    void loadLeaveBalances();
    void loadLeaveTypes();
  }, [loadLeaveBalances, loadLeaveTypes]);

  function applyFilter() {
    void loadLeaveBalances(filterEmployeeId || undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createLeaveBalance(form as CreateLeaveBalanceDto);
    setShowForm(false);
    setForm({ year: new Date().getFullYear() });
  }

  async function handleDelete(id: string | number) {
    if (window.confirm('Delete this leave balance record?')) {
      await deleteLeaveBalance(id);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Leave Balances</h1>
          <p className={styles.subtitle}>Employee leave balance registry</p>
        </div>
        <div className={styles.headerActions}>
          <input
            type="number"
            placeholder="Employee ID"
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by employee ID"
            style={{ width: '140px' }}
          />
          <button className={styles.btnSecondary} onClick={applyFilter}>Filter</button>
          <button className={styles.btnPrimary} onClick={() => setShowForm(true)}>+ Add Balance</button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Year</th>
                <th>Total</th>
                <th>Used</th>
                <th>Pending</th>
                <th>Carried</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveBalances.length === 0 ? (
                <tr><td colSpan={9} className={styles.empty}>No leave balance records found</td></tr>
              ) : (
                leaveBalances.map((b) => {
                  const available = Number(b.totalDays) + Number(b.carriedDays) - Number(b.usedDays) - Number(b.pendingDays);
                  return (
                    <tr key={String(b.id)}>
                      <td>#{b.employeeId}</td>
                      <td>{b.leaveType?.name ?? `#${b.leaveTypeId}`}</td>
                      <td>{b.year}</td>
                      <td>{b.totalDays}</td>
                      <td>{b.usedDays}</td>
                      <td>{b.pendingDays}</td>
                      <td>{b.carriedDays}</td>
                      <td><strong style={{ color: available < 0 ? '#dc2626' : '#065f46' }}>{available}</strong></td>
                      <td>
                        <button className={styles.btnDanger} onClick={() => void handleDelete(b.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add Leave Balance</h2>
              <button className={styles.modalClose} onClick={() => setShowForm(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="lb-emp">Employee ID *</label>
                  <input id="lb-emp" type="number" required value={String(form.employeeId ?? '')} onChange={(e) => setForm({ ...form, employeeId: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lb-lt">Leave Type *</label>
                  <select id="lb-lt" required value={String(form.leaveTypeId ?? '')} onChange={(e) => setForm({ ...form, leaveTypeId: Number(e.target.value) })}>
                    <option value="">Select type</option>
                    {leaveTypes.map((lt) => (
                      <option key={String(lt.id)} value={String(lt.id)}>{lt.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lb-year">Year *</label>
                  <input id="lb-year" type="number" required value={form.year ?? new Date().getFullYear()} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lb-total">Total Days *</label>
                  <input id="lb-total" type="number" min={0} step={0.5} required value={form.totalDays ?? 0} onChange={(e) => setForm({ ...form, totalDays: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lb-carried">Carried Days</label>
                  <input id="lb-carried" type="number" min={0} step={0.5} value={form.carriedDays ?? 0} onChange={(e) => setForm({ ...form, carriedDays: Number(e.target.value) })} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
