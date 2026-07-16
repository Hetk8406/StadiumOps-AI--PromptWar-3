/**
 * PageTransition Component
 * Wraps route content with consistent enter animation.
 * Respects prefers-reduced-motion OS setting.
 */

import React from 'react';
import { usePageTransition } from '../hooks/usePageTransition';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps): React.JSX.Element {
  const { style } = usePageTransition();

  return (
    <div className="motion-page-enter" style={style}>
      {children}
    </div>
  );
}
