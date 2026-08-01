/**
 * Normalized HTTP error class.
 *
 * WHY: Provides a library-agnostic error shape. Whether using Axios or Fetch,
 * the application always receives an HttpError with consistent fields.
 * This is the single error type that flows up through all layers.
 *
 * ANTI-PATTERN: Letting AxiosError or FetchError leak into feature modules.
 */

export type HttpErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'CANCELLED'
  | 'UNKNOWN_ERROR';

export interface HttpErrorData {
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
  [key: string]: unknown;
}

export class HttpError extends Error {
  readonly statusCode: number;
  readonly errorCode: HttpErrorCode;
  readonly data: HttpErrorData | null;
  readonly url: string;
  readonly method: string;
  readonly timestamp: string;

  constructor(params: {
    message: string;
    statusCode: number;
    errorCode: HttpErrorCode;
    data?: HttpErrorData | null;
    url?: string;
    method?: string;
  }) {
    super(params.message);
    this.name = 'HttpError';
    this.statusCode = params.statusCode;
    this.errorCode = params.errorCode;
    this.data = params.data ?? null;
    this.url = params.url ?? '';
    this.method = params.method ?? '';
    this.timestamp = new Date().toISOString();

    // Maintain prototype chain
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isValidationError(): boolean {
    return this.statusCode === 422 || this.statusCode === 400;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  get isNetworkError(): boolean {
    return this.errorCode === 'NETWORK_ERROR';
  }

  get isTimeout(): boolean {
    return this.errorCode === 'TIMEOUT_ERROR';
  }

  get isCancelled(): boolean {
    return this.errorCode === 'CANCELLED';
  }

  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      data: this.data,
      url: this.url,
      method: this.method,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Maps HTTP status codes to domain error codes.
 */
export function statusToErrorCode(status: number): HttpErrorCode {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 408) return 'TIMEOUT_ERROR';
  if (status === 422 || status === 400) return 'VALIDATION_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN_ERROR';
}
