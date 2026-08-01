/**
 * Native Fetch implementation of IHttpClient.
 *
 * WHY: Demonstrates that replacing Axios with Fetch requires changing only
 * this file and updating HttpClientFactory. Zero changes to feature modules.
 *
 * USAGE: Set VITE_HTTP_CLIENT=fetch to use this implementation.
 *
 * ⚠️  ONLY THIS FILE IS ALLOWED TO USE THE NATIVE FETCH API ⚠️
 */
import { apiConfig } from '@core/config/api';

import { HttpError, statusToErrorCode } from './HttpError';
import type { IHttpClient, HttpRequestConfig, HttpResponse } from './IHttpClient';

export class FetchHttpClient implements IHttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private readonly timeout: number;

  constructor(config?: { baseUrl?: string; timeout?: number }) {
    this.baseUrl = config?.baseUrl ?? apiConfig.baseUrl;
    this.timeout = config?.timeout ?? apiConfig.timeout;
    this.defaultHeaders = { ...apiConfig.headers };
  }

  private buildUrl(url: string, params?: Record<string, unknown>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

    if (!params || Object.keys(params).length === 0) return fullUrl;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    return `${fullUrl}?${searchParams.toString()}`;
  }

  private buildHeaders(config?: HttpRequestConfig): Record<string, string> {
    return { ...this.defaultHeaders, ...(config?.headers ?? {}) };
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    return response.text() as unknown as Promise<T>;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config?.timeout ?? this.timeout,
    );

    const signal = config?.signal ?? controller.signal;

    try {
      const response = await fetch(this.buildUrl(url, config?.params), {
        method,
        headers: this.buildHeaders(config),
        body: data !== undefined ? JSON.stringify(data) : undefined,
        signal,
        credentials: config?.withCredentials ? 'include' : 'same-origin',
      });

      if (!response.ok) {
        const errorData = await this.parseResponse<Record<string, unknown>>(
          response,
        ).catch(() => ({}));

        throw new HttpError({
          message:
            (errorData['message'] as string) || response.statusText,
          statusCode: response.status,
          errorCode: statusToErrorCode(response.status),
          data: errorData,
          url,
          method,
        });
      }

      const responseData = await this.parseResponse<T>(response);
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new HttpError({
          message: 'Request was cancelled or timed out.',
          statusCode: 0,
          errorCode: 'CANCELLED',
          url,
          method,
        });
      }

      throw new HttpError({
        message: error instanceof Error ? error.message : 'Network error',
        statusCode: 0,
        errorCode: 'NETWORK_ERROR',
        url,
        method,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  post<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  put<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  patch<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  delete<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}
