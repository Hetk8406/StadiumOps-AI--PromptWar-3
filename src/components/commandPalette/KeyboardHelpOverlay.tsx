/**
 * KeyboardHelpOverlay Component
 * Overlay displaying all keyboard shortcuts with entrance animation.
 */

import React from 'react';
import { X } from 'lucide-react';
import { getAllCommands } from '../../command/commandRegistry';
import type { AppCommand } from '../../command/commandTypes';

interface KeyboardHelpOverlayProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export const KeyboardHelpOverlay: React.FC<KeyboardHelpOverlayProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = getAllCommands().filter((c: AppCommand) => c.shortcut);

  const grouped: Record<string, AppCommand[]> = {};
  for (const cmd of commands) {
    if (!grouped[cmd.category]) grouped[cmd.category] = [];
    grouped[cmd.category].push(cmd);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm motion-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-bg-panel border border-stadium-border rounded-md shadow-normal max-h-[80vh] flex flex-col motion-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stadium-border">
          <h2 className="text-h3 font-semibold text-text-primary">Keyboard Shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="p-1 text-text-muted hover:text-text-primary rounded focus:outline-none focus:ring-1 focus:ring-stadium-accent motion-focus-ring"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{category}</h3>
              <div className="space-y-2">
                {cmds.map((cmd) => (
                  <div key={cmd.id} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">{cmd.label}</span>
                    <kbd className="px-2 py-0.5 bg-bg-secondary text-text-muted border border-stadium-border rounded text-[10px] font-mono">
                      {cmd.shortcut!.label}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
