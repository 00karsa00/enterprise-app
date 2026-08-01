/**
 * Logger interface.
 *
 * WHY: Feature modules call `logger.info()`, never `console.log()`.
 * Switching from Console to Sentry requires changing one file.
 *
 * PATTERN: Port in Hexagonal Architecture.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  [key: string]: unknown;
}

export interface ILogger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
  fatal(message: string, error?: Error | unknown, context?: LogContext): void;
  setContext(context: LogContext): void;
}
