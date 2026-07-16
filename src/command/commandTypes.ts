/**
 * Command System Type Definitions
 * Shared interfaces for the centralized command registry and command palette.
 */

import { LucideIcon } from 'lucide-react';

export type CommandCategory =
  | 'navigation'
  | 'actions'
  | 'ai'
  | 'search'
  | 'accessibility';

export interface KeyboardShortcut {
  readonly key: string;        // e.g., 'g' or 'k'
  readonly modifiers?: {
    readonly ctrl?: boolean;
    readonly shift?: boolean;
    readonly alt?: boolean;
  };
  readonly label: string;      // e.g., 'Ctrl + K'
}

export interface AppCommand {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly category: CommandCategory;
  readonly icon?: LucideIcon;
  readonly shortcut?: KeyboardShortcut;
  readonly execute: () => void;
  readonly hidden?: boolean;
}
