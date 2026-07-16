import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Button } from './Button';

export interface ToastProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  onClose?: () => void;
}

/**
 * Toast alert notification primitive.
 */
export function Toast({
  message,
  variant = 'info',
  onClose,
}: ToastProps): React.JSX.Element {
  const styles = {
    info: 'bg-cyan-950 border-cyan-800 text-cyan-200',
    success: 'bg-green-950 border-green-800 text-green-200',
    warning: 'bg-yellow-950 border-yellow-800 text-yellow-200',
    danger: 'bg-red-950 border-red-800 text-red-200',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-stadium-info" />,
    success: <CheckCircle className="w-5 h-5 text-stadium-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-stadium-warning" />,
    danger: <AlertCircle className="w-5 h-5 text-stadium-critical" />,
  };

  return (
    <div
      role="alert"
      className={`flex items-center justify-between p-4 border rounded-md shadow-normal max-w-sm w-full ${styles[variant]}`}
    >
      <div className="flex items-center space-x-3">
        <span aria-hidden="true">{icons[variant]}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="p-0.5 border-none hover:bg-transparent min-w-[24px] min-h-[24px]"
        >
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </Button>
      )}
    </div>
  );
}
