/**
 * Badge Component
 * Reusable status indicator with consistent enterprise styling.
 */

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  className = '',
}: BadgeProps): React.JSX.Element {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors duration-120 border';

  const variants = {
    info: 'bg-cyan-950/40 text-stadium-info border-stadium-info/20',
    success: 'bg-green-950/40 text-stadium-success border-stadium-success/20',
    warning: 'bg-yellow-950/40 text-stadium-warning border-stadium-warning/20',
    danger: 'bg-red-950/40 text-stadium-critical border-stadium-critical/20',
    neutral: 'bg-bg-panel text-text-secondary border-stadium-border',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
