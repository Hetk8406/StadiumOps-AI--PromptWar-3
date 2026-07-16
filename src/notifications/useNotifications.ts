/**
 * useNotifications Hook
 * Subscribes React components to the notification service via stable state syncing.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  subscribeNotifications,
  subscribeToasts,
  pushToast,
  pushNotification,
  dismissToast,
  markAllAsRead,
  clearNonCritical,
} from './notificationService';
import type { AppNotification, Toast, NotificationSeverity, NotificationModule, ToastVariant } from './notificationTypes';

export interface UseNotificationsResult {
  readonly notifications: AppNotification[];
  readonly toasts: Toast[];
  readonly unreadCount: number;
  readonly pushToast: (title: string, message: string, variant: ToastVariant, options?: { duration?: number }) => void;
  readonly pushNotification: (title: string, message: string, severity: NotificationSeverity, module: NotificationModule) => void;
  readonly dismissToast: (id: string) => void;
  readonly markAllAsRead: () => void;
  readonly clearNonCritical: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubNotif = subscribeNotifications(setNotifications);
    const unsubToast = subscribeToasts(setToasts);
    return () => {
      unsubNotif();
      unsubToast();
    };
  }, []);

  const handlePushToast = useCallback(
    (title: string, message: string, variant: ToastVariant, options?: { duration?: number }) => {
      pushToast(title, message, variant, options);
    },
    []
  );

  const handlePushNotification = useCallback(
    (title: string, message: string, severity: NotificationSeverity, module: NotificationModule) => {
      pushNotification(title, message, severity, module);
    },
    []
  );

  return {
    notifications,
    toasts,
    unreadCount: notifications.filter((n) => !n.read).length,
    pushToast: handlePushToast,
    pushNotification: handlePushNotification,
    dismissToast,
    markAllAsRead,
    clearNonCritical,
  };
}
