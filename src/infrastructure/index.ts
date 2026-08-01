/**
 * Infrastructure layer barrel export.
 *
 * WHY: Single entry point for all infrastructure services.
 * Feature modules import from '@infrastructure' not from deep paths.
 */
export * from './http';
export * from './storage';
export * from './logger';
export * from './notification';
export * from './analytics';
export * from './auth';
export * from './cache';
