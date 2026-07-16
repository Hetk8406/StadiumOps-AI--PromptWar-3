/**
 * Generic Reusable Utility Types
 */

export interface ApiResult<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  success: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchOptions {
  query?: string;
  fields?: string[];
}

export interface FilterOptions {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface DateRange {
  start: string;
  end: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type Nullable<T> = T | null;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type ReadonlyEntity<T> = {
  readonly [P in keyof T]: T[P];
};
