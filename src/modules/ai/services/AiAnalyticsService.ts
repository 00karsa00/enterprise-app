import { logger } from '@infrastructure/logger/LoggerFactory';
import { aiAnalyticsRepository } from '../repository/AiAnalyticsRepository';
import type {
  AiAnalyticsMaster,
  AiAnalyticsFilters,
  CreateAiAnalyticsMasterDto,
  UpdateAiAnalyticsMasterDto,
} from '../types/ai.types';
import type { PaginatedResponse } from '@/types';

export class AiAnalyticsService {
  findAll(filters: AiAnalyticsFilters): Promise<PaginatedResponse<AiAnalyticsMaster>> {
    return aiAnalyticsRepository.findAll(filters);
  }

  findOne(id: string | number): Promise<AiAnalyticsMaster> {
    return aiAnalyticsRepository.findOne(id);
  }

  async create(data: CreateAiAnalyticsMasterDto): Promise<AiAnalyticsMaster> {
    logger.info('Registering table in analytics master', { tableName: data.tableName });
    return aiAnalyticsRepository.create(data);
  }

  update(id: string | number, data: UpdateAiAnalyticsMasterDto): Promise<AiAnalyticsMaster> {
    return aiAnalyticsRepository.update(id, data);
  }

  delete(id: string | number): Promise<void> {
    return aiAnalyticsRepository.delete(id);
  }

  syncCounts(): Promise<{ synced: number }> {
    return aiAnalyticsRepository.syncCounts();
  }
}

export const aiAnalyticsService = new AiAnalyticsService();
