/**
 * Tooltip Component
 * Accessible tooltip with entrance animation.
 */

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({
  content,
  children,
  position = 'top',
}: TooltipProps): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      aria-describedby={isVisible ? 'tooltip-desc' : undefined}
    >
      {children}
      {isVisible && (
        <div
          id="tooltip-desc"
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap bg-bg-secondary text-text-primary border border-stadium-border text-xs px-2 py-1 rounded-md shadow-subtle motion-fade-in ${positions[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
