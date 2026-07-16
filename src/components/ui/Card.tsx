/**
 * Card Component
 * Enterprise panel container with motion micro-interactions.
 * Supports hover elevation, focus, and selection states.
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', role, style }: CardProps): React.JSX.Element {
  return (
    <div
      role={role}
      style={style}
      className={`bg-bg-panel border border-stadium-border rounded-md shadow-subtle p-4 motion-card-hover ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps): React.JSX.Element {
  return (
    <div className={`border-b border-stadium-border pb-3 mb-3 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps): React.JSX.Element {
  return (
    <h3 className={`text-base font-semibold text-text-primary ${className}`}>
      {children}
    </h3>
  );
}
