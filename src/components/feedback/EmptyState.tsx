/**
 * Reusable Enterprise EmptyState Component
 * Standardizes visual representation of zero-data queries with semantic headers and layout containers.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly actionLabel?: string;
  readonly onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-bg-panel border border-dashed border-stadium-border rounded-md min-h-[220px]">
      <Icon className="w-10 h-10 text-text-muted mb-3" aria-hidden="true" />
      <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      <p className="text-xs text-text-muted mt-1 max-w-sm">{description}</p>
      {actionLabel && onActionClick && (
        <Button variant="outline" size="sm" onClick={onActionClick} className="mt-4 text-xs font-semibold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
