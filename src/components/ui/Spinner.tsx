import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Standard spinner loader indicator.
 */
export function Spinner({ size = 'md', className = '' }: SpinnerProps): React.JSX.Element {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block border-current border-t-transparent text-stadium-accent rounded-full animate-spin ${sizes[size]} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
