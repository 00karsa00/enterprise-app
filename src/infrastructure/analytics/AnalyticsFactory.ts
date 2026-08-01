/**
 * Analytics Factory.
 *
 * Swap providers by changing VITE_ANALYTICS_PROVIDER in .env.
 */
import { env } from '@core/config/env';

import type { IAnalyticsService } from './IAnalytics';
import { NoopAnalyticsAdapter } from './NoopAnalyticsAdapter';

export class AnalyticsFactory {
  static create(): IAnalyticsService {
    switch (env.VITE_ANALYTICS_PROVIDER) {
      case 'none':
      default:
        return new NoopAnalyticsAdapter();
      // case 'google': return new GoogleAnalyticsAdapter(env.VITE_ANALYTICS_KEY);
      // case 'mixpanel': return new MixpanelAdapter(env.VITE_ANALYTICS_KEY);
      // case 'amplitude': return new AmplitudeAdapter(env.VITE_ANALYTICS_KEY);
    }
  }
}

/** Application-wide analytics service singleton */
export const analytics = AnalyticsFactory.create();
