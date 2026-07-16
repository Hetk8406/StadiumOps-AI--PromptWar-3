import { IncidentSeverity, IncidentStatus } from '../enums';

/**
 * Generates a unique ID matching a specified prefix contract.
 */
export function generateId(prefix: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${new Date().getFullYear().toString().substring(2)}-${randomStr}`;
}

/**
 * Format Date to standard YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '--';
  return d.toISOString().split('T')[0];
}

/**
 * Format Time to HH:mm
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '--';
  return d.toTimeString().split(' ')[0].substring(0, 5);
}

/**
 * Format DateTime to YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '--';
  return `${formatDate(d)} ${d.toTimeString().split(' ')[0]}`;
}

/**
 * Capitalizes the first character of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates string contents to a specified length
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

/**
 * Get color maps for severity tag
 */
export function getSeverityColor(severity: IncidentSeverity): 'danger' | 'warning' | 'info' | 'neutral' {
  const colors: Record<IncidentSeverity, 'danger' | 'warning' | 'info' | 'neutral'> = {
    [IncidentSeverity.CRITICAL]: 'danger',
    [IncidentSeverity.HIGH]: 'danger',
    [IncidentSeverity.MEDIUM]: 'warning',
    [IncidentSeverity.LOW]: 'neutral',
  };
  return colors[severity] || 'neutral';
}

/**
 * Get color maps for status tag
 */
export function getStatusColor(status: IncidentStatus): 'danger' | 'warning' | 'info' | 'success' | 'neutral' {
  const colors: Record<IncidentStatus, 'danger' | 'warning' | 'info' | 'success' | 'neutral'> = {
    [IncidentStatus.OPEN]: 'neutral',
    [IncidentStatus.INVESTIGATING]: 'warning',
    [IncidentStatus.ASSIGNED]: 'info',
    [IncidentStatus.RESOLVED]: 'success',
    [IncidentStatus.ESCALATED]: 'danger',
  };
  return colors[status] || 'neutral';
}

/**
 * Resolves priority level
 */
export function getPriorityLabel(priority: number): string {
  const labels: Record<number, string> = {
    1: 'Critical',
    2: 'High',
    3: 'Medium',
    4: 'Low',
    5: 'Lowest',
  };
  return labels[priority] || 'Medium';
}

/**
 * Check if severity represents critical state
 */
export function isCritical(severity: IncidentSeverity): boolean {
  return severity === IncidentSeverity.CRITICAL;
}

/**
 * Formats duration in minutes to HH:mm readable text
 */
export function formatDuration(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) return '0 min';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  return `${hrs}h ${mins}m`;
}

/**
 * Calculates current capacity utilization percentage
 */
export function calculateOccupancy(current: number, capacity: number): number {
  if (!capacity || isNaN(current) || isNaN(capacity)) return 0;
  return Math.round((current / capacity) * 100);
}

/**
 * Safe parser for strings to numbers with fallback defaults
 */
export function safeParseNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}
