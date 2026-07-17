/**
 * ToastItem Component
 * Individual toast with enter/exit animation, severity bar, and ARIA live region.
 */

import { memo } from 'react';
import { X, CheckCircle2, Info, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import type { Toast as ToastType } from '../../notifications/notificationTypes';
import { dismissToast } from '../../notifications/notificationService';

interface ToastItemProps {
  readonly toast: ToastType;
}

const VARIANT_CONFIG = {
  success: {
    bg: 'bg-bg-panel border-stadium-success/40',
    icon: <CheckCircle2 className="w-4 h-4 text-stadium-success shrink-0" />,
    bar: 'bg-stadium-success',
  },
  info: {
    bg: 'bg-bg-panel border-stadium-info/40',
    icon: <Info className="w-4 h-4 text-stadium-info shrink-0" />,
    bar: 'bg-stadium-info',
  },
  warning: {
    bg: 'bg-bg-panel border-stadium-warning/40',
    icon: <AlertTriangle className="w-4 h-4 text-stadium-warning shrink-0" />,
    bar: 'bg-stadium-warning',
  },
  error: {
    bg: 'bg-bg-panel border-stadium-critical/40',
    icon: <AlertCircle className="w-4 h-4 text-stadium-critical shrink-0" />,
    bar: 'bg-stadium-critical',
  },
  ai: {
    bg: 'bg-bg-panel border-stadium-accent/40',
    icon: <Sparkles className="w-4 h-4 text-stadium-accent shrink-0" />,
    bar: 'bg-stadium-accent',
  },
} as const;

const ToastItem = memo(function ToastItem({ toast }: ToastItemProps) {
  const config = VARIANT_CONFIG[toast.variant];
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`relative flex items-start gap-3 w-80 p-3 rounded-md border shadow-lg text-xs motion-toast-enter pointer-events-auto ${config.bg}`}
    >
      {/* Severity bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-md ${config.bar}`} aria-hidden="true" />

      {config.icon}

      <div className="flex-1 min-w-0">
        <strong className="block text-text-primary font-bold truncate">{toast.title}</strong>
        <span className="text-text-secondary text-[11px] leading-snug">{toast.message}</span>
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="mt-1.5 text-stadium-accent font-semibold text-[10px] hover:underline focus:outline-none focus:ring-1 focus:ring-stadium-accent rounded motion-focus-ring"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
        className="text-text-muted hover:text-text-primary focus:outline-none focus:ring-1 focus:ring-stadium-accent rounded motion-focus-ring p-0.5"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

export default ToastItem;
