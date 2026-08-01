/**
 * Common domain-agnostic types used across the entire application.
 * These types have NO dependency on any third-party library.
 */

/** Unique identifier type */
export type ID = string | number;

/** ISO 8601 date string */
export type ISODateString = string;

/** Generic key-value record */
export type Dictionary<T = unknown> = Record<string, T>;

/** Makes all properties of T optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Makes specified keys required */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Nullable type helper */
export type Nullable<T> = T | null;

/** Optional type helper */
export type Maybe<T> = T | null | undefined;

/** Async function type */
export type AsyncFn<TArgs extends unknown[] = [], TReturn = void> = (
  ...args: TArgs
) => Promise<TReturn>;

/** Generic callback */
export type Callback<T = void> = (value: T) => void;

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Paginated response envelope */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sort parameters */
export interface SortParams {
  field: string;
  direction: SortDirection;
}

/** Filter parameters */
export interface FilterParams {
  search?: string;
  [key: string]: unknown;
}

/** Generic query parameters combining pagination, sort and filter */
export interface QueryParams extends PaginationParams {
  sort?: SortParams;
  filter?: FilterParams;
}

/** Generic API success response */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: ISODateString;
}

/** Generic async state */
export interface AsyncState<T> {
  data: Nullable<T>;
  isLoading: boolean;
  error: Nullable<AppError>;
}

/** Application error shape */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  statusCode?: number;
  timestamp?: ISODateString;
}

/** HTTP method types */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Request status */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
