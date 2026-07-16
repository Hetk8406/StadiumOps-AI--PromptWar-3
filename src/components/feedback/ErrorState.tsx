/**
 * Reusable Enterprise ErrorState Component
 * Displays system exception boundaries clearly, detailing severe errors with inline retry prompts.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  readonly title: string;
  readonly message: string;
  readonly onRetry?: () => void;
  readonly details?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  details,
}) => {
  return (
    <div className="p-4 bg-stadium-critical/10 border border-stadium-critical/30 rounded-md text-xs text-text-secondary space-y-3">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-stadium-critical shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <strong className="block text-stadium-critical font-bold">{title}</strong>
          <p className="text-[11px] text-text-secondary">{message}</p>
        </div>
      </div>

      {details && (
        <details className="mt-2 text-[10px] text-text-muted bg-bg-secondary/40 p-2 rounded cursor-pointer border border-stadium-border/40">
          <summary className="font-semibold select-none">Technical Details</summary>
          <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-mono">{details}</pre>
        </details>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="w-full text-[11px] font-semibold text-stadium-critical border-stadium-critical/40 hover:bg-stadium-critical/10"
        >
          Retry Process
        </Button>
      )}
    </div>
  );
};
