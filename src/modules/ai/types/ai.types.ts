/**
 * AI analytics module domain types.
 */
import type { ID, ISODateString } from '@/types';

export interface AiAnalyticsMaster {
  id: ID;
  schemaName: string;
  tableName: string;
  tableDescription?: string | null;
  tableCategory?: string | null;
  primaryKeyColumn: string;
  totalRecords: number;
  lastSyncedAt?: ISODateString | null;
  isActive: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateAiAnalyticsMasterDto {
  schemaName?: string;
  tableName: string;
  tableDescription?: string;
  tableCategory?: string;
  primaryKeyColumn?: string;
  metadata?: Record<string, unknown>;
}

export type UpdateAiAnalyticsMasterDto = Partial<CreateAiAnalyticsMasterDto> & {
  isActive?: boolean;
  totalRecords?: number;
};

export interface AiAnalyticsFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}
