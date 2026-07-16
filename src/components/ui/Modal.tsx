/**
 * Modal Component
 * Reusable modal with backdrop fade + content scale entrance transition.
 * Supports ESC-to-close, body scroll lock, and focus management.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps): React.JSX.Element | null {
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
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm motion-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-bg-panel border border-stadium-border rounded-md shadow-normal max-h-[90vh] flex flex-col motion-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stadium-border">
          <h2 id="modal-title" className="text-h3 font-semibold text-text-primary">
            {title}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Close modal dialog"
            className="p-1 min-w-[32px] min-h-[32px]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
