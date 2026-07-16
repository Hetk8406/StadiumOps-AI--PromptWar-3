/**
 * ActivityFeed Component
 * Chronological timeline of operational events with subtle entrance transitions.
 */

import React, { memo } from 'react';
import {
  AlertTriangle,
  Users,
  Activity,
  Accessibility,
  Radio,
  FileText,
  Settings,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { useNotifications } from '../../notifications/useNotifications';
import { formatRelativeTime } from '../../notifications/timeUtils';
import type { NotificationModule } from '../../notifications/notificationTypes';

const MODULE_ICON: Record<NotificationModule, React.ReactNode> = {
  incidents: <AlertTriangle className="w-3.5 h-3.5 text-stadium-critical" />,
  volunteers: <Users className="w-3.5 h-3.5 text-stadium-accent" />,
  crowd: <Activity className="w-3.5 h-3.5 text-stadium-warning" />,
  communications: <Radio className="w-3.5 h-3.5 text-stadium-info" />,
  accessibility: <Accessibility className="w-3.5 h-3.5 text-stadium-success" />,
  reports: <FileText className="w-3.5 h-3.5 text-text-secondary" />,
  settings: <Settings className="w-3.5 h-3.5 text-text-muted" />,
  ai: <Sparkles className="w-3.5 h-3.5 text-stadium-accent" />,
  system: <Cpu className="w-3.5 h-3.5 text-text-muted" />,
};

interface ActivityFeedProps {
  readonly maxItems?: number;
  readonly className?: string;
}

export const ActivityFeed = memo(function ActivityFeed({ maxItems = 20, className = '' }: ActivityFeedProps) {
  const { notifications } = useNotifications();
  const items = notifications.slice(0, maxItems);

  return (
    <div className={`space-y-1 ${className}`} aria-label="Activity Feed">
      {items.length === 0 ? (
        <p className="text-xs text-text-muted text-center py-4">No recent activity.</p>
      ) : (
        <ol className="space-y-1">
          {items.map((n) => (
            <li key={n.id} className="flex items-start gap-2 text-[11px] text-text-secondary py-1.5 border-b border-stadium-border/30 last:border-0 motion-table-row">
              <span className="mt-0.5 shrink-0">{MODULE_ICON[n.module]}</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-text-primary">{n.title}</span>
                <span className="text-text-muted"> — {n.message}</span>
              </div>
              <time className="shrink-0 text-[9px] text-text-muted" dateTime={new Date(n.timestamp).toISOString()}>
                {formatRelativeTime(n.timestamp)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
});
