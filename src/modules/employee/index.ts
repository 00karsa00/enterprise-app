/**
 * Employee module public API.
 *
 * RULE: Other modules and the app layer only import from this file,
 * never from deep paths within the employee module.
 * This enforces module boundaries and makes refactoring safe.
 */
export * from './types';
export * from './components';
export * from './pages';
export * from './routes';
export * from './hooks';
export * from './constants';
export * from './validators';
export * from './utils';
