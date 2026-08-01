/**
 * Analytics interface.
 *
 * WHY: Feature modules track events without knowing which provider is used.
 * Swapping Google Analytics for Mixpanel requires changing one file.
 */

export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export interface IAnalyticsService {
  identify(userId: string, traits?: AnalyticsEventProperties): void;
  track(event: string, properties?: AnalyticsEventProperties): void;
  page(name: string, properties?: AnalyticsEventProperties): void;
  reset(): void;
}
