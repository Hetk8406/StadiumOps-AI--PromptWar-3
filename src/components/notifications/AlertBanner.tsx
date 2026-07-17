/**
 * AlertBanner Component
 * Dismissible critical alert banner with entrance animation.
 */

import React, { memo, useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

type AlertBannerVariant = 'critical' | 'warning' | 'info';

interface AlertBannerProps {
  readonly message: string;
  readonly variant?: AlertBannerVariant;
  readonly onDismiss?: () => void;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

const VARIANT_STYLES: Record<AlertBannerVariant, { container: string; icon: React.ReactNode }> = {
  critical: {
    container: 'bg-stadium-critical/15 border-stadium-critical/30 text-stadium-critical',
    icon: <AlertCircle className="w-4 h-4 shrink-0" />,
  },
  warning: {
    container: 'bg-stadium-warning/15 border-stadium-warning/30 text-stadium-warning',
    icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
  },
  info: {
    container: 'bg-stadium-info/15 border-stadium-info/30 text-stadium-info',
    icon: <Info className="w-4 h-4 shrink-0" />,
  },
};

export const AlertBanner = memo(function AlertBanner({
  message,
  variant = 'warning',
  onDismiss,
  actionLabel,
  onAction,
}: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  const styles = VARIANT_STYLES[variant];

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold border-b motion-slide-in-down ${styles.container}`}
    >
      {styles.icon}
      <span className="flex-1 leading-snug">{message}</span>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="underline text-[10px] font-bold hover:no-underline motion-focus-ring focus:outline-none focus:ring-1 rounded">
          {actionLabel}
        </button>
      )}
      {onDismiss !== undefined && (
        <button type="button" aria-label="Dismiss banner" onClick={handleDismiss} className="ml-2 hover:opacity-70 motion-focus-ring focus:outline-none focus:ring-1 rounded p-0.5">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});
