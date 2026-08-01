/**
 * HTTP Client Factory — the single point of client creation.
 *
 * WHY: Centralizes the decision of which HTTP implementation to use.
 * To switch from Axios to Fetch: change one line in this factory.
 * All consumers call `httpClientFactory.create()` and get IHttpClient.
 *
 * PATTERN: Factory Method + Singleton for the default instance.
 */
import { AxiosHttpClient } from './AxiosHttpClient';
import type { IHttpClient } from './IHttpClient';
// import { FetchHttpClient } from './FetchHttpClient'; // Swap here to use Fetch

export class HttpClientFactory {
  private static instance: IHttpClient | null = null;

  /**
   * Creates a new HTTP client instance.
   * To switch implementations, change the class instantiated here.
   */
  static create(): IHttpClient {
    // ✅ Swap implementation here — zero changes in feature modules
    return new AxiosHttpClient();
    // return new FetchHttpClient(); // Switch to Fetch
  }

  /**
   * Returns a shared singleton instance.
   * Use this for the default application-wide HTTP client.
   */
  static getInstance(): IHttpClient {
    if (!HttpClientFactory.instance) {
      HttpClientFactory.instance = HttpClientFactory.create();
    }
    return HttpClientFactory.instance;
  }

  /**
   * Reset the singleton (useful for testing).
   */
  static reset(): void {
    HttpClientFactory.instance = null;
  }
}

/**
 * The application-wide HTTP client instance.
 * All repositories use this singleton.
 */
export const httpClient = HttpClientFactory.getInstance();
