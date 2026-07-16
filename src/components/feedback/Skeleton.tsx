/**
 * Skeleton Component
 * Accessible loading placeholder with refined pulse animation.
 * Respects prefers-reduced-motion for inclusive loading states.
 */

import React from 'react';

interface SkeletonProps {
  readonly className?: string;
  readonly height?: string;
  readonly width?: string;
  readonly variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height,
  width,
  variant = 'rect',
}) => {
  const shapeClass =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded h-3 my-1.5'
      : 'rounded-md';

  return (
    <div
      className={`bg-bg-secondary/60 motion-skeleton-pulse ${shapeClass} ${className}`}
      style={{ height, width }}
      role="status"
      aria-label="Loading..."
    />
  );
};
