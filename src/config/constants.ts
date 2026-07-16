/**
 * Shared Application Constants
 */

export const APP_CONFIG = {
  name: 'StadiumOps AI – FIFA World Cup 2026',
  version: '1.0.0',
};

export const ROUTES = {
  DASHBOARD: '/',
  INCIDENTS: '/incidents',
  VOLUNTEERS: '/volunteers',
  CROWD: '/crowd',
  COMMUNICATIONS: '/communications',
  ACCESSIBILITY: '/accessibility',
  SETTINGS: '/settings',
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
] as const;

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum CrowdStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CONGESTED = 'CONGESTED',
  CRITICAL = 'CRITICAL',
}
