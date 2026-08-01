/**
 * HTTP Client interface — the abstraction boundary.
 *
 * WHY: Every module uses this interface, never Axios/Fetch directly.
 * Swapping HTTP libraries means implementing this interface once in
 * infrastructure and changing HttpClientFactory. Zero feature changes.
 *
 * PATTERN: Port in Hexagonal Architecture.
 *
 * FORBIDDEN: axios, fetch — this file must have zero third-party imports.
 */

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  signal?: AbortSignal;
  withCredentials?: boolean;
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface IHttpClient {
  get<T = unknown>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>;

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>;

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>;

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>;

  delete<T = unknown>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>>;

  setHeader(key: string, value: string): void;
  removeHeader(key: string): void;
  setBaseUrl(url: string): void;
}
