/**
 * No-op analytics implementation — the default when no provider is configured.
 *
 * WHY: Prevents null checks throughout the codebase (Null Object Pattern).
 * When VITE_ANALYTICS_PROVIDER=none, analytics calls are silently ignored.
 */
import type { IAnalyticsService, AnalyticsEventProperties } from './IAnalytics';

export class NoopAnalyticsAdapter implements IAnalyticsService {
  identify(_userId: string, _traits?: AnalyticsEventProperties): void {}
  track(_event: string, _properties?: AnalyticsEventProperties): void {}
  page(_name: string, _properties?: AnalyticsEventProperties): void {}
  reset(): void {}
}
