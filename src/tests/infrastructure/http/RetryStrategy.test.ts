import { HttpError } from '@infrastructure/http/HttpError';
import { RetryStrategy } from '@infrastructure/http/RetryStrategy';
import { describe, it, expect, vi } from 'vitest';

describe('RetryStrategy', () => {
  const strategy = new RetryStrategy({
    maxAttempts: 3,
    delayMs: 10,
    backoffMultiplier: 2,
    maxDelayMs: 100,
    retryableStatusCodes: [500, 503],
  });

  function makeError(params: { statusCode: number; errorCode?: string }): HttpError {
    return new HttpError({
      message: 'test error',
      statusCode: params.statusCode,
      errorCode: (params.errorCode as Parameters<typeof HttpError>[0]['errorCode']) ?? 'SERVER_ERROR',
    });
  }

  it('should retry on 500', () => {
    expect(strategy.shouldRetry(makeError({ statusCode: 500 }), 1)).toBe(true);
  });

  it('should not retry on 400 (client error)', () => {
    const e = makeError({ statusCode: 400, errorCode: 'VALIDATION_ERROR' });
    expect(strategy.shouldRetry(e, 1)).toBe(false);
  });

  it('should not retry when max attempts reached', () => {
    expect(strategy.shouldRetry(makeError({ statusCode: 500 }), 3)).toBe(false);
  });

  it('should not retry cancelled requests', () => {
    const e = new HttpError({ message: 'cancelled', statusCode: 0, errorCode: 'CANCELLED' });
    expect(strategy.shouldRetry(e, 1)).toBe(false);
  });

  it('getDelay returns increasing delays with backoff', () => {
    const d1 = strategy.getDelay(1);
    const d2 = strategy.getDelay(2);
    // d2 should be roughly 2x d1 (with jitter, just check d2 > d1 / 1.5)
    expect(d2).toBeGreaterThan(d1 * 1.5);
  });

  it('executeWithRetry resolves on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await strategy.executeWithRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('executeWithRetry retries and eventually resolves', async () => {
    let attempts = 0;
    const fn = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) throw new HttpError({ message: 'err', statusCode: 500, errorCode: 'SERVER_ERROR' });
      return Promise.resolve('success');
    });

    const result = await strategy.executeWithRetry(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
