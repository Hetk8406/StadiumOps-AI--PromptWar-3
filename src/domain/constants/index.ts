/**
 * Centralized Domain Constants
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
] as const;

export const SUPPORTED_STADIUMS = [
  { id: 'metlife', name: 'MetLife Stadium', city: 'East Rutherford, NJ', capacity: 82500 },
  { id: 'sofi', name: 'SoFi Stadium', city: 'Los Angeles, CA', capacity: 70240 },
  { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City, MX', capacity: 87523 },
] as const;

export const SEVERITY_COLORS = {
  CRITICAL: 'danger',
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'neutral',
} as const;

export const STATUS_COLORS = {
  OPEN: 'neutral',
  INVESTIGATING: 'warning',
  ASSIGNED: 'info',
  RESOLVED: 'success',
  ESCALATED: 'danger',
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATE_TIME: 'YYYY-MM-DD HH:mm:ss',
} as const;

export const APP_LIMITS = {
  MAX_INCIDENTS_PER_PAGE: 50,
  MAX_BROADCAST_CHARACTERS: 500,
  MAX_ATTACHMENT_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
} as const;
