/**
 * NotificationCenter Component
 * Slide-in notification panel with entrance animation,
 * read/unread tracking, and batch operations.
 */

import React, { memo, useState } from 'react';
import {
  BellRing,
  X,
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useNotifications } from '../../notifications/useNotifications';
import { formatRelativeTime } from '../../notifications/timeUtils';
import type { NotificationSeverity } from '../../notifications/notificationTypes';
import { Button } from '../ui/Button';

const SEVERITY_ICON: Record<NotificationSeverity, React.ReactNode> = {
  critical: <AlertCircle className="w-3.5 h-3.5 text-stadium-critical" />,
  high: <AlertTriangle className="w-3.5 h-3.5 text-stadium-warning" />,
  medium: <AlertTriangle className="w-3.5 h-3.5 text-stadium-warning" />,
  low: <Info className="w-3.5 h-3.5 text-stadium-info" />,
  info: <Info className="w-3.5 h-3.5 text-stadium-info" />,
  success: <CheckCircle2 className="w-3.5 h-3.5 text-stadium-success" />,
};

interface NotificationCenterProps {
  trigger?: React.ReactNode;
}

const NotificationCenter = memo(function NotificationCenter({ trigger }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearNonCritical } = useNotifications();

  const renderedTrigger = trigger ? (
    React.cloneElement(trigger as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void; 'aria-expanded'?: boolean }>, {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen((o) => !o);
      },
      'aria-expanded': open,
    })
  ) : (
    <button
      type="button"
      aria-label={`Notifications — ${unreadCount} unread`}
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      className="relative p-2 rounded text-[#9ca3af] hover:text-stadium-accent focus:outline-none focus:ring-1 focus:ring-stadium-accent motion-focus-ring transition-colors duration-200"
    >
      <BellRing className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-stadium-critical text-[9px] font-bold text-white px-1 leading-none motion-fade-in">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      {renderedTrigger}

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 motion-fade-in" aria-hidden="true" onClick={() => setOpen(false)} />
      )}

      {/* Slide panel */}
      {open && (
        <aside
          role="dialog"
          aria-label="Notification Center"
          className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-bg-panel border-l border-stadium-border shadow-2xl flex flex-col motion-notification-slide"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stadium-border">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-stadium-accent" />
              <h2 className="text-sm font-bold text-text-primary">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-stadium-critical text-white text-[9px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              type="button"
              aria-label="Close notification center"
              onClick={() => setOpen(false)}
              className="p-1 text-text-muted hover:text-text-primary rounded focus:outline-none focus:ring-1 focus:ring-stadium-accent motion-focus-ring"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-stadium-border">
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex items-center gap-1 text-[10px]">
              <CheckCheck className="w-3 h-3" /> Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={clearNonCritical} className="flex items-center gap-1 text-[10px] text-stadium-critical border-stadium-critical/40 hover:bg-stadium-critical/10">
              <Trash2 className="w-3 h-3" /> Clear
            </Button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-muted text-xs gap-2">
                <Sparkles className="w-8 h-8 opacity-30" />
                <span>No notifications yet</span>
              </div>
            ) : (
              <ul className="divide-y divide-stadium-border/40">
                {notifications.map((n) => (
                  <li key={n.id} className={`px-4 py-3 flex items-start gap-2.5 text-xs motion-table-row hover:bg-bg-secondary/40 ${!n.read ? 'bg-stadium-accent/5' : ''}`}>
                    <span className="mt-0.5 shrink-0">{SEVERITY_ICON[n.severity]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-1">
                        <strong className={`text-[11px] font-semibold truncate ${!n.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {n.title}
                        </strong>
                        <span className="text-[9px] text-text-muted shrink-0">{formatRelativeTime(n.timestamp)}</span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5 leading-snug">{n.message}</p>
                      {n.action && (
                        <button type="button" onClick={n.action.onClick} className="mt-1 text-stadium-accent text-[10px] font-semibold hover:underline">
                          {n.action.label}
                        </button>
                      )}
                    </div>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-stadium-accent shrink-0 mt-1.5" aria-label="Unread" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      )}
    </>
  );
});

export default NotificationCenter;
