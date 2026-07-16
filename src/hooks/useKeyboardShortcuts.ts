/**
 * Keyboard Shortcuts Hook
 * Registers global event listener for keyboard shortcuts in the command registry.
 * Ignores triggers if focused in an input/textarea.
 */

import { useEffect } from 'react';
import { getAllCommands } from '../command/commandRegistry';

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea or contenteditable element
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const activeCommands = getAllCommands();

      for (const cmd of activeCommands) {
        if (!cmd.shortcut) continue;

        const { key, modifiers } = cmd.shortcut;
        const matchesKey = event.key.toLowerCase() === key.toLowerCase();
        const matchesCtrl = !modifiers?.ctrl || event.ctrlKey || event.metaKey;
        const matchesShift = !modifiers?.shift || event.shiftKey;
        const matchesAlt = !modifiers?.alt || event.altKey;

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
          event.preventDefault();
          cmd.execute();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
