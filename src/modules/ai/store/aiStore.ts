/**
 * AI Analytics Store — Zustand state.
 * ⚠️ ONLY THIS FILE imports Zustand in the ai module.
 */
import { notify } from '@infrastructure/notification/NotificationFactory';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { aiAnalyticsService } from '../services/AiAnalyticsService';
import type {
  AiAnalyticsMaster,
  AiAnalyticsFilters,
  CreateAiAnalyticsMasterDto,
  UpdateAiAnalyticsMasterDto,
} from '../types/ai.types';

interface AiStoreState {
  entries: AiAnalyticsMaster[];
  selectedEntry: AiAnalyticsMaster | null;
  pagination: { total: number; page: number; totalPages: number };
  filters: AiAnalyticsFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  isSyncing: boolean;
  error: string | null;

  loadEntries: (filters?: Partial<AiAnalyticsFilters>) => Promise<void>;
  createEntry: (data: CreateAiAnalyticsMasterDto) => Promise<AiAnalyticsMaster | null>;
  updateEntry: (id: string | number, data: UpdateAiAnalyticsMasterDto) => Promise<AiAnalyticsMaster | null>;
  deleteEntry: (id: string | number) => Promise<boolean>;
  syncCounts: () => Promise<void>;
  selectEntry: (entry: AiAnalyticsMaster | null) => void;
  clearError: () => void;
}

const useAiStoreInternal = create<AiStoreState>()(
  devtools(
    (set, get) => ({
      entries: [],
      selectedEntry: null,
      pagination: { total: 0, page: 1, totalPages: 0 },
      filters: { page: 1, limit: 50 },
      isLoading: false,
      isSubmitting: false,
      isSyncing: false,
      error: null,

      loadEntries: async (filters) => {
        const merged = { ...get().filters, ...filters };
        set({ isLoading: true, error: null, filters: merged });
        try {
          const result = await aiAnalyticsService.findAll(merged);
          set({
            entries: result.items,
            pagination: { total: result.total, page: result.page, totalPages: result.totalPages },
            isLoading: false,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load analytics data';
          set({ error: msg, isLoading: false });
          notify.error(msg);
        }
      },

      createEntry: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const entry = await aiAnalyticsService.create(data);
          set((state) => ({ entries: [entry, ...state.entries], isSubmitting: false }));
          notify.success(`Table "${entry.tableName}" registered`);
          return entry;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to register table';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      updateEntry: async (id, data) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await aiAnalyticsService.update(id, data);
          set((state) => ({
            entries: state.entries.map((e) => (e.id === id ? updated : e)),
            selectedEntry: state.selectedEntry?.id === id ? updated : state.selectedEntry,
            isSubmitting: false,
          }));
          notify.success('Entry updated');
          return updated;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to update entry';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return null;
        }
      },

      deleteEntry: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await aiAnalyticsService.delete(id);
          set((state) => ({
            entries: state.entries.filter((e) => e.id !== id),
            selectedEntry: state.selectedEntry?.id === id ? null : state.selectedEntry,
            isSubmitting: false,
          }));
          notify.success('Entry removed');
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to delete entry';
          set({ error: msg, isSubmitting: false });
          notify.error(msg);
          return false;
        }
      },

      syncCounts: async () => {
        set({ isSyncing: true });
        try {
          const { synced } = await aiAnalyticsService.syncCounts();
          notify.success(`Synced record counts for ${synced} tables`);
          // Reload after sync
          const merged = get().filters;
          const result = await aiAnalyticsService.findAll(merged);
          set({ entries: result.items, isSyncing: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Sync failed';
          set({ isSyncing: false });
          notify.error(msg);
        }
      },

      selectEntry: (entry) => set({ selectedEntry: entry }),
      clearError: () => set({ error: null }),
    }),
    { name: 'ai-analytics-store' },
  ),
);

export const useAiStore = useAiStoreInternal;
