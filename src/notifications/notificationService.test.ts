import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  pushNotification,
  pushToast,
  subscribeNotifications,
  subscribeToasts,
  markAllAsRead,
  clearNonCritical,
  dismissToast,
  notify,
} from './notificationService';

describe('Notification Service', () => {
  beforeEach(() => {
    // Reset notification listeners and lists between tests if necessary,
    // since the service has module-scoped state.
    vi.useFakeTimers();
  });

  it('should push a notification and notify subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeNotifications(listener);

    // Initial subscribe call
    expect(listener).toHaveBeenCalledTimes(1);

    pushNotification('Test Alert', 'Test Message', 'high', 'incidents');

    expect(listener).toHaveBeenCalledTimes(2);
    const lastCall = listener.mock.calls[1][0];
    expect(lastCall[0]).toMatchObject({
      title: 'Test Alert',
      message: 'Test Message',
      severity: 'high',
      module: 'incidents',
      read: false,
    });

    unsubscribe();
  });

  it('should push a toast and notify subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToasts(listener);

    expect(listener).toHaveBeenCalledTimes(1);

    pushToast('Toast Title', 'Toast Msg', 'success', { duration: 2000 });

    expect(listener).toHaveBeenCalledTimes(2);
    const lastCall = listener.mock.calls[1][0];
    expect(lastCall[0]).toMatchObject({
      title: 'Toast Title',
      message: 'Toast Msg',
      variant: 'success',
      duration: 2000,
    });

    // Fast-forward timers to trigger auto-dismissal
    vi.advanceTimersByTime(2000);
    // After dismissal, it should be called again with empty or reduced list
    expect(listener).toHaveBeenCalledTimes(3);

    unsubscribe();
  });

  it('should mark all notifications as read', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeNotifications(listener);

    pushNotification('Notif 1', 'Msg 1', 'low', 'system');
    pushNotification('Notif 2', 'Msg 2', 'medium', 'system');

    markAllAsRead();

    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall.every((n: { read: boolean }) => n.read === true)).toBe(true);

    unsubscribe();
  });

  it('should clear non-critical notifications', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeNotifications(listener);

    // Clear notifications list by using clearNonCritical with no critical items
    clearNonCritical();
    
    pushNotification('Notif Critical', 'Msg 1', 'critical', 'system');
    pushNotification('Notif Low', 'Msg 2', 'low', 'system');

    clearNonCritical();

    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall.length).toBe(1);
    expect(lastCall[0].severity).toBe('critical');

    unsubscribe();
  });

  it('should manually dismiss a toast', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToasts(listener);

    pushToast('Toast', 'Msg', 'info');
    const toastId = listener.mock.calls[1][0][0].id;

    dismissToast(toastId);

    const lastCall = listener.mock.calls[2][0];
    expect(lastCall.find((t: { id: string }) => t.id === toastId)).toBeUndefined();

    unsubscribe();
  });

  it('should support shorthand notify convenience helpers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToasts(listener);

    notify.success('S1', 'M1');
    notify.info('S2', 'M2');
    notify.warning('S3', 'M3');
    notify.error('S4', 'M4');
    notify.ai('S5', 'M5');

    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall.length).toBe(5);

    unsubscribe();
  });
});
