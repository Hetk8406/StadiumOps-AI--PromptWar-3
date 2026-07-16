/**
 * Notification Domain Types
 * Shared type definitions for the enterprise notification system.
 */

export type NotificationSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success';
export type NotificationModule =
  | 'incidents'
  | 'volunteers'
  | 'crowd'
  | 'communications'
  | 'accessibility'
  | 'reports'
  | 'settings'
  | 'ai'
  | 'system';

export interface NotificationAction {
  readonly label: string;
  readonly onClick: () => void;
}

export interface AppNotification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly severity: NotificationSeverity;
  readonly module: NotificationModule;
  readonly timestamp: number;
  readonly read: boolean;
  readonly action?: NotificationAction;
  readonly persistent?: boolean;
}

export type ToastVariant = 'success' | 'info' | 'warning' | 'error' | 'ai';

export interface Toast {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly variant: ToastVariant;
  readonly duration?: number;
  readonly action?: NotificationAction;
}

export interface NotificationPreferences {
  readonly toastDuration: number;
  readonly aiNotificationsEnabled: boolean;
  readonly criticalAlertsEnabled: boolean;
  readonly activityFeedVisible: boolean;
  readonly quietMode: boolean;
}
