/**
 * AiAnalyticsRepository — HTTP data access.
 * ⚠️ ONLY THIS FILE calls httpClient in the ai module.
 */
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import type { PaginatedResponse } from '@/types';
import type {
  AiAnalyticsMaster,
  AiAnalyticsFilters,
  CreateAiAnalyticsMasterDto,
  UpdateAiAnalyticsMasterDto,
} from '../types/ai.types';

const BASE = '/ai/analytics';

/** Shape of the raw paginated envelope returned by the API. */
interface ApiPaginatedEnvelope<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Top-level API success wrapper: { success, data: <payload>, meta } */
interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

/** Maps the API paginated envelope to the frontend PaginatedResponse shape. */
function mapPaginated<T>(envelope: ApiPaginatedEnvelope<T>): PaginatedResponse<T> {
  return {
    items: envelope.items,
    total: envelope.total,
    page: envelope.page,
    pageSize: envelope.limit,
    totalPages: envelope.totalPages,
    hasNextPage: envelope.hasNext,
    hasPreviousPage: envelope.hasPrev,
  };
}

export class AiAnalyticsRepository {
  async findAll(filters: AiAnalyticsFilters): Promise<PaginatedResponse<AiAnalyticsMaster>> {
    const res = await httpClient.get<ApiSuccessResponse<ApiPaginatedEnvelope<AiAnalyticsMaster>>>(BASE, {
      params: filters,
    });
    return mapPaginated(res.data.data);
  }

  async findOne(id: string | number): Promise<AiAnalyticsMaster> {
    const res = await httpClient.get<ApiSuccessResponse<AiAnalyticsMaster>>(`${BASE}/${id}`);
    return res.data.data;
  }

  async findByTableName(tableName: string): Promise<AiAnalyticsMaster> {
    const res = await httpClient.get<ApiSuccessResponse<AiAnalyticsMaster>>(`${BASE}/table/${tableName}`);
    return res.data.data;
  }

  async create(data: CreateAiAnalyticsMasterDto): Promise<AiAnalyticsMaster> {
    const res = await httpClient.post<ApiSuccessResponse<AiAnalyticsMaster>>(BASE, data);
    return res.data.data;
  }

  async update(id: string | number, data: UpdateAiAnalyticsMasterDto): Promise<AiAnalyticsMaster> {
    const res = await httpClient.patch<ApiSuccessResponse<AiAnalyticsMaster>>(`${BASE}/${id}`, data);
    return res.data.data;
  }

  async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${BASE}/${id}`);
  }

  async syncCounts(): Promise<{ synced: number }> {
    const res = await httpClient.get<ApiSuccessResponse<{ synced: number }>>(`${BASE}/sync`);
    return res.data.data;
  }
}

export const aiAnalyticsRepository = new AiAnalyticsRepository();
