/**
 * Drawer Component
 * Slide-out details panel with backdrop fade + panel slide transitions.
 * Supports ESC-to-close and body scroll lock.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps): React.JSX.Element | null {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm motion-fade-in"
    >
      <div className="w-full max-w-md bg-bg-panel border-l border-stadium-border h-full flex flex-col shadow-normal motion-notification-slide">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stadium-border">
          <h2 id="drawer-title" className="text-h3 font-semibold text-text-primary">
            {title}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Close details drawer"
            className="p-1 min-w-[32px] min-h-[32px]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
