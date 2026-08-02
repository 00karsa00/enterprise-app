/**
 * AiAnalyticsPage — full CRUD view for ai_analytics_master.
 * Shows table registry with record counts, categories, and sync control.
 */
import { useEffect, useState } from 'react';
import { useAiStore } from '../store/aiStore';
import type { AiAnalyticsMaster, CreateAiAnalyticsMasterDto } from '../types/ai.types';
import styles from '../../organisation/pages/Organisation.module.css';

const CATEGORIES = ['Core', 'Employee', 'Leave', 'Organisation', 'AI'];

export function AiAnalyticsPage() {
  const {
    entries,
    pagination,
    isLoading,
    isSubmitting,
    isSyncing,
    loadEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    syncCounts,
  } = useAiStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AiAnalyticsMaster | null>(null);
  const [form, setForm] = useState<Partial<CreateAiAnalyticsMasterDto>>({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { void loadEntries(); }, [loadEntries]);

  function applyFilters() {
    void loadEntries({ search: search || undefined, category: category || undefined, page: 1 });
  }

  function openCreate() {
    setEditing(null);
    setForm({ schemaName: 'public', primaryKeyColumn: 'id' });
    setShowForm(true);
  }

  function openEdit(entry: AiAnalyticsMaster) {
    setEditing(entry);
    setForm({
      tableName: entry.tableName,
      schemaName: entry.schemaName,
      tableDescription: entry.tableDescription ?? '',
      tableCategory: entry.tableCategory ?? '',
      primaryKeyColumn: entry.primaryKeyColumn,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateEntry(editing.id, form);
    } else {
      await createEntry(form as CreateAiAnalyticsMasterDto);
    }
    setShowForm(false);
  }

  async function handleDelete(id: string | number) {
    if (window.confirm('Remove this table from the analytics registry?')) {
      await deleteEntry(id);
    }
  }

  // ── Stats by category ───────────────────────────────────────────────────────
  const totalRecords = entries.reduce((sum, e) => sum + Number(e.totalRecords), 0);
  const categories = [...new Set(entries.map((e) => e.tableCategory).filter(Boolean))];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>AI Analytics Master</h1>
          <p className={styles.subtitle}>{pagination.total} tables registered · {totalRecords.toLocaleString()} total records</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.btnSecondary}
            onClick={() => void syncCounts()}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : '↻ Sync Counts'}
          </button>
          <button className={styles.btnPrimary} onClick={openCreate}>+ Register Table</button>
        </div>
      </div>

      {/* Category stats */}
      <div className={styles.statsGrid}>
        {categories.map((cat) => {
          const catEntries = entries.filter((e) => e.tableCategory === cat);
          const catTotal = catEntries.reduce((s, e) => s + Number(e.totalRecords), 0);
          return (
            <div className={styles.statCard} key={cat}>
              <div className={styles.statLabel}>{cat}</div>
              <div className={styles.statValue}>{catEntries.length} tables</div>
              <div className={styles.statMeta}>{catTotal.toLocaleString()} records</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Search tables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.filterSelect}
          style={{ minWidth: '200px' }}
          aria-label="Search tables"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.filterSelect} aria-label="Filter by category">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className={styles.btnSecondary} onClick={applyFilters}>Apply</button>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Total Records</th>
                <th>Last Synced</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={7} className={styles.empty}>No tables registered</td></tr>
              ) : (
                entries.map((e) => (
                  <tr key={String(e.id)}>
                    <td>
                      <div>
                        <code style={{ fontSize: '0.875rem' }}>{e.schemaName}.{e.tableName}</code>
                      </div>
                    </td>
                    <td>
                      {e.tableCategory && (
                        <span className={styles.categoryBadge}>{e.tableCategory}</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '250px', fontSize: '0.8rem', color: '#6b7280' }}>
                      {e.tableDescription ?? '—'}
                    </td>
                    <td><strong>{Number(e.totalRecords).toLocaleString()}</strong></td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {e.lastSyncedAt ? new Date(e.lastSyncedAt).toLocaleString() : '—'}
                    </td>
                    <td>
                      <span className={e.isActive ? styles.badgeActive : styles.badgeInactive}>
                        {e.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnSecondary} onClick={() => openEdit(e)}>Edit</button>
                        <button className={styles.btnDanger} onClick={() => void handleDelete(e.id)}>Remove</button>
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
              <h2>{editing ? 'Edit Analytics Entry' : 'Register Table'}</h2>
              <button className={styles.modalClose} onClick={() => setShowForm(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="ai-table">Table Name *</label>
                  <input id="ai-table" required value={form.tableName ?? ''} onChange={(e) => setForm({ ...form, tableName: e.target.value })} disabled={!!editing} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="ai-schema">Schema</label>
                  <input id="ai-schema" value={form.schemaName ?? 'public'} onChange={(e) => setForm({ ...form, schemaName: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="ai-cat">Category</label>
                  <select id="ai-cat" value={form.tableCategory ?? ''} onChange={(e) => setForm({ ...form, tableCategory: e.target.value })}>
                    <option value="">— None —</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="ai-pk">Primary Key Column</label>
                  <input id="ai-pk" value={form.primaryKeyColumn ?? 'id'} onChange={(e) => setForm({ ...form, primaryKeyColumn: e.target.value })} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="ai-desc">Description</label>
                  <textarea id="ai-desc" rows={2} value={form.tableDescription ?? ''} onChange={(e) => setForm({ ...form, tableDescription: e.target.value })} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
