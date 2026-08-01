/**
 * Logger Factory — creates the appropriate logger based on configuration.
 *
 * To switch logging providers: update VITE_LOG_PROVIDER in .env.
 * Zero changes to feature modules.
 */
import { env } from '@core/config/env';

import { ConsoleLogger } from './ConsoleLogger';
import type { ILogger } from './ILogger';

export class LoggerFactory {
  static create(): ILogger {
    switch (env.VITE_LOG_PROVIDER) {
      case 'console':
      default:
        return new ConsoleLogger();
      // case 'sentry': return new SentryLogger();
      // case 'datadog': return new DatadogLogger();
      // case 'azure': return new AzureMonitorLogger();
    }
  }
}

/** Application-wide logger singleton */
export const logger = LoggerFactory.create();
