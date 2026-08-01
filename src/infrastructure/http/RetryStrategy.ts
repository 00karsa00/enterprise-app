/**
 * Retry strategy for HTTP requests.
 *
 * WHY: Transient failures (network blips, 503s) should be retried automatically.
 * Extracted here so the retry logic is testable independently of the HTTP client.
 *
 * PATTERN: Strategy Pattern — inject different strategies per use case.
 */
import { HttpError } from './HttpError';

export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
  retryableStatusCodes: number[];
}

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 30000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

export class RetryStrategy {
  constructor(private readonly config: RetryConfig = defaultRetryConfig) {}

  shouldRetry(error: HttpError, attemptNumber: number): boolean {
    if (attemptNumber >= this.config.maxAttempts) return false;
    if (error.isCancelled) return false;
    if (error.isNetworkError) return true;
    if (error.isTimeout) return true;
    return this.config.retryableStatusCodes.includes(error.statusCode);
  }

  getDelay(attemptNumber: number): number {
    const delay =
      this.config.delayMs *
      Math.pow(this.config.backoffMultiplier, attemptNumber - 1);

    // Add jitter (±10%) to prevent thundering herd
    const jitter = delay * 0.1 * (Math.random() * 2 - 1);
    return Math.min(delay + jitter, this.config.maxDelayMs);
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    onRetry?: (error: HttpError, attempt: number) => void,
  ): Promise<T> {
    let lastError: HttpError | undefined;

    for (let attempt = 1; attempt <= this.config.maxAttempts + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (!(error instanceof HttpError)) throw error;
        lastError = error;

        if (!this.shouldRetry(error, attempt)) throw error;

        const delay = this.getDelay(attempt);
        onRetry?.(error, attempt);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
