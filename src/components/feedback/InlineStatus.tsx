/**
 * Reusable Enterprise InlineStatus Component
 * Small status/informational chips styled for inline messages (success, warning, info, loading).
 */

import React from 'react';
import { AlertCircle, CheckCircle2, Info, RefreshCw } from 'lucide-react';

interface InlineStatusProps {
  readonly type: 'success' | 'info' | 'warning' | 'error' | 'loading';
  readonly message: string;
}

export const InlineStatus: React.FC<InlineStatusProps> = ({ type, message }) => {
  const styles = {
    success: 'bg-stadium-success/15 border-stadium-success/30 text-stadium-success',
    info: 'bg-stadium-info/15 border-stadium-info/30 text-stadium-info',
    warning: 'bg-stadium-warning/15 border-stadium-warning/30 text-stadium-warning',
    error: 'bg-stadium-critical/15 border-stadium-critical/30 text-stadium-critical',
    loading: 'bg-bg-secondary border-stadium-border text-text-secondary',
  };

  const icons = {
    success: <CheckCircle2 className="w-3.5 h-3.5" />,
    info: <Info className="w-3.5 h-3.5" />,
    warning: <AlertCircle className="w-3.5 h-3.5" />,
    error: <AlertCircle className="w-3.5 h-3.5" />,
    loading: <RefreshCw className="w-3.5 h-3.5 animate-spin" />,
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold border rounded-md ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};
