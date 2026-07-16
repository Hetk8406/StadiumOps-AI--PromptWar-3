/**
 * Notification Service
 * Framework-independent imperative API for dispatching notifications and toasts.
 * Components consume via useNotifications() hook; never call this directly from React components.
 */

import { AppNotification, Toast, NotificationSeverity, NotificationModule, ToastVariant } from './notificationTypes';

type NotificationListener = (notifications: AppNotification[]) => void;
type ToastListener = (toasts: Toast[]) => void;

let notifications: AppNotification[] = [];
let toasts: Toast[] = [];
const notificationListeners: Set<NotificationListener> = new Set();
const toastListeners: Set<ToastListener> = new Set();

let notifIdCounter = 0;
let toastIdCounter = 0;

// ── Notification Center ──────────────────────────────────────────────────────

function emitNotifications(): void {
  notificationListeners.forEach((fn) => fn([...notifications]));
}

function emitToasts(): void {
  toastListeners.forEach((fn) => fn([...toasts]));
}

export function subscribeNotifications(fn: NotificationListener): () => void {
  notificationListeners.add(fn);
  fn([...notifications]);
  return () => notificationListeners.delete(fn);
}

export function subscribeToasts(fn: ToastListener): () => void {
  toastListeners.add(fn);
  fn([...toasts]);
  return () => toastListeners.delete(fn);
}

export function pushNotification(
  title: string,
  message: string,
  severity: NotificationSeverity,
  module: NotificationModule,
  options?: { action?: AppNotification['action']; persistent?: boolean }
): void {
  const notif: AppNotification = {
    id: `notif-${++notifIdCounter}`,
    title,
    message,
    severity,
    module,
    timestamp: Date.now(),
    read: false,
    action: options?.action,
    persistent: options?.persistent ?? false,
  };
  notifications = [notif, ...notifications].slice(0, 100);
  emitNotifications();
}

export function markAllAsRead(): void {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  emitNotifications();
}

export function clearNonCritical(): void {
  notifications = notifications.filter((n) => n.severity === 'critical' || n.persistent);
  emitNotifications();
}

// ── Toast System ─────────────────────────────────────────────────────────────

export function pushToast(
  title: string,
  message: string,
  variant: ToastVariant,
  options?: { duration?: number; action?: Toast['action'] }
): void {
  const toast: Toast = {
    id: `toast-${++toastIdCounter}`,
    title,
    message,
    variant,
    duration: options?.duration ?? 4000,
    action: options?.action,
  };
  toasts = [...toasts, toast].slice(-5); // max 5 simultaneous
  emitToasts();

  if (toast.duration && toast.duration > 0) {
    setTimeout(() => dismissToast(toast.id), toast.duration);
  }
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  emitToasts();
}

// Convenience helpers
export const notify = {
  success: (title: string, message: string) => pushToast(title, message, 'success'),
  info: (title: string, message: string) => pushToast(title, message, 'info'),
  warning: (title: string, message: string) => pushToast(title, message, 'warning'),
  error: (title: string, message: string) => pushToast(title, message, 'error'),
  ai: (title: string, message: string) => pushToast(title, message, 'ai'),
};
