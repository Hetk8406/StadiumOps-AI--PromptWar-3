/**
 * Loading Component
 * Full-page loading spinner with standard accessibility helpers.
 */

import React from 'react';

export default function Loading(): React.JSX.Element {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className="flex items-center justify-center p-8 space-x-2"
    >
      <div className="w-8 h-8 border-4 border-stadium-accent border-t-transparent rounded-full animate-spin" />
      <span className="text-text-muted font-medium">Loading command feed...</span>
    </div>
  );
}
