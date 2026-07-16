/**
 * Common Shared Types
 */

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export interface UserProfile {
  id: string;
  name: string;
  role: 'OPERATOR' | 'ADMIN' | 'FIELD_COMMANDER';
  email: string;
}

export interface Zone {
  id: string;
  name: string; // e.g. Gate A, North Stand
  description: string;
}
