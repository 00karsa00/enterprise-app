import { ConsoleLogger } from '@infrastructure/logger/ConsoleLogger';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * In non-development environments the ConsoleLogger outputs structured JSON
 * via console.log. We spy on console.log for the majority of assertions.
 */
describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger('debug');
    // Spy on ALL console methods — the logger picks one based on level + env
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emits output for info level', () => {
    logger.info('test message');
    // In test/production env the logger uses console.log (structured JSON)
    const called =
      (console.info as ReturnType<typeof vi.fn>).mock.calls.length > 0 ||
      (console.log as ReturnType<typeof vi.fn>).mock.calls.length > 0;
    expect(called).toBe(true);
  });

  it('emits output for warn level', () => {
    logger.warn('warning');
    const called =
      (console.warn as ReturnType<typeof vi.fn>).mock.calls.length > 0 ||
      (console.log as ReturnType<typeof vi.fn>).mock.calls.length > 0;
    expect(called).toBe(true);
  });

  it('emits output for error level', () => {
    logger.error('error', new Error('oops'));
    const called =
      (console.error as ReturnType<typeof vi.fn>).mock.calls.length > 0 ||
      (console.log as ReturnType<typeof vi.fn>).mock.calls.length > 0;
    expect(called).toBe(true);
  });

  it('does not log when message is below min level', () => {
    const warnOnlyLogger = new ConsoleLogger('warn');
    // Clear any setup calls first
    vi.clearAllMocks();
    warnOnlyLogger.debug('debug should be suppressed');
    warnOnlyLogger.info('info should be suppressed');

    const anyCallCount =
      (console.info as ReturnType<typeof vi.fn>).mock.calls.length +
      (console.debug as ReturnType<typeof vi.fn>).mock.calls.length +
      (console.log as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(anyCallCount).toBe(0);
  });

  it('setContext stores context that appears in subsequent logs', () => {
    logger.setContext({ service: 'employee-service' });
    vi.clearAllMocks();
    logger.info('context test');

    // Collect all calls from all console methods
    const allArgs = [
      ...(console.info as ReturnType<typeof vi.fn>).mock.calls,
      ...(console.log as ReturnType<typeof vi.fn>).mock.calls,
    ].flat();

    expect(JSON.stringify(allArgs)).toContain('employee-service');
  });
});
