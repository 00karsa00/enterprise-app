/**
 * Axios implementation of IHttpClient.
 *
 * WHY: This is the ONLY file in the application that imports Axios.
 * All Axios-specific configuration, interceptors, and error mapping live here.
 * Swapping to Fetch requires replacing this file only.
 *
 * PATTERN: Adapter in Hexagonal Architecture.
 *
 * ⚠️  ONLY THIS FILE IS ALLOWED TO IMPORT AXIOS ⚠️
 */
import { apiConfig } from '@core/config/api';
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from 'axios';

import { HttpError, statusToErrorCode, type HttpErrorCode } from './HttpError';
import type { IHttpClient, HttpRequestConfig, HttpResponse } from './IHttpClient';

export class AxiosHttpClient implements IHttpClient {
  private readonly client: AxiosInstance;

  constructor(config?: Partial<typeof apiConfig>) {
    const mergedConfig = { ...apiConfig, ...config };

    this.client = axios.create({
      baseURL: mergedConfig.baseUrl,
      timeout: mergedConfig.timeout,
      headers: mergedConfig.headers,
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add CSRF token if present in cookie
        const csrfToken = this.getCsrfToken();
        if (csrfToken && config.headers) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
      },
      (error: unknown) => Promise.reject(this.normalizeError(error)),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: unknown) => Promise.reject(this.normalizeError(error)),
    );
  }

  private getCsrfToken(): string | null {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='));
    return match ? (match.split('=')[1] ?? null) : null;
  }

  private normalizeError(error: unknown): HttpError {
    if (isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return new HttpError({
          message: 'Request timed out. Please try again.',
          statusCode: 408,
          errorCode: 'TIMEOUT_ERROR',
          url: error.config?.url ?? '',
          method: error.config?.method?.toUpperCase() ?? '',
        });
      }

      if (!error.response) {
        return new HttpError({
          message: 'Network error. Please check your connection.',
          statusCode: 0,
          errorCode: 'NETWORK_ERROR',
          url: error.config?.url ?? '',
          method: error.config?.method?.toUpperCase() ?? '',
        });
      }

      if (axios.isCancel(error)) {
        return new HttpError({
          message: 'Request was cancelled.',
          statusCode: 0,
          errorCode: 'CANCELLED',
          url: error.config?.url ?? '',
          method: error.config?.method?.toUpperCase() ?? '',
        });
      }

      const status = error.response.status;
      const errorCode: HttpErrorCode = statusToErrorCode(status);
      const responseData = error.response.data as Record<string, unknown>;

      return new HttpError({
        message:
          (responseData['message'] as string) ||
          error.message ||
          'An error occurred',
        statusCode: status,
        errorCode,
        data: responseData,
        url: error.config?.url ?? '',
        method: error.config?.method?.toUpperCase() ?? '',
      });
    }

    return new HttpError({
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: 0,
      errorCode: 'UNKNOWN_ERROR',
    });
  }

  private toAxiosConfig(config?: HttpRequestConfig): AxiosRequestConfig {
    return {
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      signal: config?.signal,
      withCredentials: config?.withCredentials,
      responseType: config?.responseType ?? 'json',
    };
  }

  private toHttpResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  }

  async get<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.get<T>(url, this.toAxiosConfig(config));
    return this.toHttpResponse(response);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.post<T>(
      url,
      data,
      this.toAxiosConfig(config),
    );
    return this.toHttpResponse(response);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.put<T>(
      url,
      data,
      this.toAxiosConfig(config),
    );
    return this.toHttpResponse(response);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.patch<T>(
      url,
      data,
      this.toAxiosConfig(config),
    );
    return this.toHttpResponse(response);
  }

  async delete<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.delete<T>(
      url,
      this.toAxiosConfig(config),
    );
    return this.toHttpResponse(response);
  }

  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  removeHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }

  setBaseUrl(url: string): void {
    this.client.defaults.baseURL = url;
  }
}
