/**
 * Feature flags configuration.
 *
 * WHY: Enables/disables features without code changes or deployments.
 * Supports gradual rollout, A/B testing, and kill switches.
 *
 * PATTERN: All flags default to false (opt-in safety model).
 */
import { env } from './env';

export const FEATURES = {
  EMPLOYEE_BULK_ACTIONS: env.VITE_FEATURE_FLAGS_ENABLED,
  EMPLOYEE_EXPORT_CSV: env.VITE_FEATURE_FLAGS_ENABLED,
  ADVANCED_FILTERS: env.VITE_FEATURE_FLAGS_ENABLED,
  DARK_MODE: true,
  NOTIFICATIONS_CENTER: true,
  ANALYTICS_DASHBOARD: env.VITE_FEATURE_FLAGS_ENABLED,
  MAINTENANCE_MODE: env.VITE_MAINTENANCE_MODE,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

/**
 * Check if a feature flag is enabled.
 * Use this in components instead of accessing FEATURES directly
 * so you can swap the implementation (e.g., remote config) later.
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURES[flag] === true;
}
