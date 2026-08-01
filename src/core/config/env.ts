/**
 * Environment configuration with Zod validation.
 *
 * WHY: Centralizes all environment variable access and validates at startup.
 * Any missing or invalid env var fails loudly in development.
 *
 * ALLOWED DEPENDENCIES: zod (validation only — acceptable at config boundary)
 * FORBIDDEN: business logic, API calls, UI imports
 */
import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1).default('Enterprise App'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_API_TIMEOUT: z.coerce.number().positive().default(30000),
  VITE_API_RETRY_ATTEMPTS: z.coerce.number().min(0).max(5).default(3),
  VITE_API_RETRY_DELAY_MS: z.coerce.number().positive().default(1000),
  VITE_AUTH_PROVIDER: z
    .enum(['jwt', 'oauth', 'keycloak', 'firebase'])
    .default('jwt'),
  VITE_AUTH_TOKEN_KEY: z.string().default('auth_token'),
  VITE_AUTH_REFRESH_TOKEN_KEY: z.string().default('auth_refresh_token'),
  VITE_STORAGE_PREFIX: z.string().default('enterprise_'),
  VITE_NOTIFICATION_PROVIDER: z.enum(['sonner', 'toastify']).default('sonner'),
  VITE_NOTIFICATION_DURATION: z.coerce.number().positive().default(4000),
  VITE_LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
  VITE_LOG_PROVIDER: z
    .enum(['console', 'sentry', 'datadog', 'azure'])
    .default('console'),
  VITE_ANALYTICS_PROVIDER: z
    .enum(['google', 'mixpanel', 'amplitude', 'none'])
    .default('none'),
  VITE_ANALYTICS_KEY: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_FEATURE_FLAGS_ENABLED: z.coerce.boolean().default(false),
  VITE_MAINTENANCE_MODE: z.coerce.boolean().default(false),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});

type EnvConfig = z.infer<typeof envSchema>;

function parseEnv(): EnvConfig {
  const result = envSchema.safeParse({
    VITE_APP_NAME: import.meta.env['VITE_APP_NAME'],
    VITE_APP_VERSION: import.meta.env['VITE_APP_VERSION'],
    VITE_API_BASE_URL: import.meta.env['VITE_API_BASE_URL'],
    VITE_API_TIMEOUT: import.meta.env['VITE_API_TIMEOUT'],
    VITE_API_RETRY_ATTEMPTS: import.meta.env['VITE_API_RETRY_ATTEMPTS'],
    VITE_API_RETRY_DELAY_MS: import.meta.env['VITE_API_RETRY_DELAY_MS'],
    VITE_AUTH_PROVIDER: import.meta.env['VITE_AUTH_PROVIDER'],
    VITE_AUTH_TOKEN_KEY: import.meta.env['VITE_AUTH_TOKEN_KEY'],
    VITE_AUTH_REFRESH_TOKEN_KEY: import.meta.env['VITE_AUTH_REFRESH_TOKEN_KEY'],
    VITE_STORAGE_PREFIX: import.meta.env['VITE_STORAGE_PREFIX'],
    VITE_NOTIFICATION_PROVIDER: import.meta.env['VITE_NOTIFICATION_PROVIDER'],
    VITE_NOTIFICATION_DURATION: import.meta.env['VITE_NOTIFICATION_DURATION'],
    VITE_LOG_LEVEL: import.meta.env['VITE_LOG_LEVEL'],
    VITE_LOG_PROVIDER: import.meta.env['VITE_LOG_PROVIDER'],
    VITE_ANALYTICS_PROVIDER: import.meta.env['VITE_ANALYTICS_PROVIDER'],
    VITE_ANALYTICS_KEY: import.meta.env['VITE_ANALYTICS_KEY'],
    VITE_SENTRY_DSN: import.meta.env['VITE_SENTRY_DSN'],
    VITE_FEATURE_FLAGS_ENABLED: import.meta.env['VITE_FEATURE_FLAGS_ENABLED'],
    VITE_MAINTENANCE_MODE: import.meta.env['VITE_MAINTENANCE_MODE'],
    MODE: import.meta.env['MODE'],
  });

  if (!result.success) {
    const formatted = result.error.format();
    console.error('❌ Invalid environment variables:', formatted);
    throw new Error('Environment validation failed. Check console for details.');
  }

  return result.data;
}

export const env = parseEnv();

export const isDev = env.MODE === 'development';
export const isProd = env.MODE === 'production';
export const isTest = env.MODE === 'test';
