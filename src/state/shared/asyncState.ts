/**
 * Standardised Async State Model
 * Handles loading status and error payloads consistently.
 */

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function createInitialAsyncState<T>(initialData: T | null = null): AsyncState<T> {
  return {
    data: initialData,
    loading: false,
    error: null,
  };
}
