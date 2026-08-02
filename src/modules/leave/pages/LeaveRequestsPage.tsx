/**
 * LeaveRequestsPage — list, approve, reject, cancel & create leave requests.
 */
import { useEffect, useState } from 'react';
import { useLeaveStore } from '../store/leaveStore';
import type { CreateLeaveRequestDto, LeaveRequestStatus } from '../types/leave.types';
import styles from '../../organisation/pages/Organisation.module.css';

const STATUS_LABELS: Record<LeaveRequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const STATUS_STYLES: Record<LeaveRequestStatus, string> = {
  pending: styles.badgePending,
  approved: styles.badgeActive,
  rejected: styles.badgeInactive,
  cancelled: styles.badgeCancelled,
};

export function LeaveRequestsPage() {
  const {
    leaveRequests,
    leaveTypes,
    requestPagination,
    requestFilters,
    isLoading,
    isSubmitting,
    loadLeaveRequests,
    loadLeaveTypes,
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    cancelLeaveRequest,
    deleteLeaveRequest,
  } = useLeaveStore();

  const [showForm, setShowForm] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [form, setForm] = useState<Partial<CreateLeaveRequestDto>>({});
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    void loadLeaveRequests();
    void loadLeaveTypes();
  }, [loadLeaveRequests, loadLeaveTypes]);

  function applyStatusFilter(status: string) {
    setStatusFilter(status);
    void loadLeaveRequests({ status: (status as LeaveRequestStatus) || undefined, page: 1 });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createLeaveRequest(form as CreateLeaveRequestDto);
    setShowForm(false);
    setForm({});
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (rejectingId) {
      await rejectLeaveRequest(rejectingId, rejectReason);
      setRejectingId(null);
      setRejectReason('');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Leave Requests</h1>
          <p className={styles.subtitle}>{requestPagination.total} requests</p>
        </div>
        <div className={styles.headerActions}>
          <select value={statusFilter} onChange={(e) => applyStatusFilter(e.target.value)} className={styles.filterSelect} aria-label="Filter by status">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className={styles.btnPrimary} onClick={() => { setShowForm(true); setForm({ totalDays: 1, halfDay: false }); }}>
            + New Request
          </button>
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
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <tr><td colSpan={7} className={styles.empty}>No leave requests found</td></tr>
              ) : (
                leaveRequests.map((req) => (
                  <tr key={String(req.id)}>
                    <td>#{req.employeeId}</td>
                    <td>{req.leaveType?.name ?? `#${req.leaveTypeId}`}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.totalDays}{req.halfDay ? ' (½)' : ''}</td>
                    <td><span className={STATUS_STYLES[req.status]}>{STATUS_LABELS[req.status]}</span></td>
                    <td>
                      <div className={styles.actions}>
                        {req.status === 'pending' && (
                          <>
                            <button className={styles.btnSecondary} onClick={() => void approveLeaveRequest(req.id)}>Approve</button>
                            <button className={styles.btnDanger} onClick={() => setRejectingId(req.id)}>Reject</button>
                            <button className={styles.btnSecondary} onClick={() => void cancelLeaveRequest(req.id)}>Cancel</button>
                          </>
                        )}
                        <button className={styles.btnDanger} onClick={() => void deleteLeaveRequest(req.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Request Modal */}
      {showForm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>New Leave Request</h2>
              <button className={styles.modalClose} onClick={() => setShowForm(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="lr-emp">Employee ID *</label>
                  <input id="lr-emp" type="number" required value={String(form.employeeId ?? '')} onChange={(e) => setForm({ ...form, employeeId: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lr-type">Leave Type *</label>
                  <select id="lr-type" required value={String(form.leaveTypeId ?? '')} onChange={(e) => setForm({ ...form, leaveTypeId: Number(e.target.value) })}>
                    <option value="">Select type</option>
                    {leaveTypes.map((lt) => (
                      <option key={String(lt.id)} value={String(lt.id)}>{lt.name} ({lt.code})</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lr-start">Start Date *</label>
                  <input id="lr-start" type="date" required value={form.startDate ?? ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lr-end">End Date *</label>
                  <input id="lr-end" type="date" required value={form.endDate ?? ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lr-days">Total Days *</label>
                  <input id="lr-days" type="number" min={0.5} step={0.5} required value={form.totalDays ?? 1} onChange={(e) => setForm({ ...form, totalDays: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input type="checkbox" checked={!!form.halfDay} onChange={(e) => setForm({ ...form, halfDay: e.target.checked })} />
                    {' '}Half Day
                  </label>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="lr-reason">Reason</label>
                  <textarea id="lr-reason" rows={2} value={form.reason ?? ''} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId !== null && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal} style={{ maxWidth: '400px' }}>
            <div className={styles.modalHeader}>
              <h2>Reject Leave Request</h2>
              <button className={styles.modalClose} onClick={() => setRejectingId(null)} aria-label="Close">×</button>
            </div>
            <form onSubmit={(e) => void handleReject(e)} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="reject-reason">Rejection Reason *</label>
                <textarea id="reject-reason" required rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setRejectingId(null)}>Cancel</button>
                <button type="submit" className={styles.btnDanger} disabled={isSubmitting}>
                  {isSubmitting ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
