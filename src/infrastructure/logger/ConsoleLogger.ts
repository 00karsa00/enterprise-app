/**
 * Console logger implementation.
 *
 * WHY: Development-friendly logger with colored output and context support.
 * In production, swap for SentryLogger or DatadogLogger via LoggerFactory.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO USE console.log/warn/error ⚠️
 * (Except for emergency diagnostics)
 */
import { env, isDev } from '@core/config/env';

import type { ILogger, LogContext, LogLevel } from './ILogger';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

const LEVEL_STYLES: Record<LogLevel, string> = {
  debug: 'color: #6c757d',
  info: 'color: #0d6efd',
  warn: 'color: #ffc107',
  error: 'color: #dc3545',
  fatal: 'color: #721c24; font-weight: bold',
};

export class ConsoleLogger implements ILogger {
  private readonly minLevel: LogLevel;
  private globalContext: LogContext = {};

  constructor(minLevel: LogLevel = env.VITE_LOG_LEVEL) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel];
  }

  private log(
    level: LogLevel,
    message: string,
    error?: Error | unknown,
    context?: LogContext,
  ): void {
    if (!this.shouldLog(level)) return;

    const mergedContext = { ...this.globalContext, ...context };
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (isDev) {
      const style = LEVEL_STYLES[level];
      const args: unknown[] = [`%c${prefix} ${message}`, style];
      if (Object.keys(mergedContext).length > 0) args.push(mergedContext);
      if (error) args.push(error);

      if (level === 'error' || level === 'fatal') {
        console.error(...args);
      } else if (level === 'warn') {
        console.warn(...args);
      } else if (level === 'debug') {
        console.debug(...args);
      } else {
        console.info(...args);
      }
    } else {
      // In production, output structured JSON for log aggregators
      const entry = {
        level,
        message,
        timestamp,
        ...mergedContext,
        ...(error instanceof Error && {
          error: { message: error.message, stack: error.stack },
        }),
      };
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, undefined, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, undefined, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, undefined, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.log('error', message, error, context);
  }

  fatal(message: string, error?: Error | unknown, context?: LogContext): void {
    this.log('fatal', message, error, context);
  }

  setContext(context: LogContext): void {
    this.globalContext = { ...this.globalContext, ...context };
  }
}
