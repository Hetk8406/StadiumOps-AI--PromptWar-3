/**
 * Command Palette Component
 * Slide/modal dialog with backdrop fade + panel scale entrance,
 * search filtering, keyboard navigation, and selection feedback.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Sparkles, Navigation, Settings, HelpCircle, Activity } from 'lucide-react';
import { getAllCommands } from '../../command/commandRegistry';
import type { AppCommand } from '../../command/commandTypes';

interface CommandPaletteProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset indices on search or toggle
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Command filter / Fuzzy match
  const filteredCommands = useMemo(() => {
    const commands = getAllCommands();
    if (!search.trim()) return commands;
    const term = search.toLowerCase();
    return commands.filter(
      (c: AppCommand) =>
        c.label.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
    );
  }, [search]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev + 1 >= filteredCommands.length ? 0 : prev + 1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? filteredCommands.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].execute();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation':
        return <Navigation className="w-3.5 h-3.5 text-stadium-info" />;
      case 'ai':
        return <Sparkles className="w-3.5 h-3.5 text-stadium-accent" />;
      case 'actions':
        return <Activity className="w-3.5 h-3.5 text-stadium-success" />;
      case 'settings':
        return <Settings className="w-3.5 h-3.5 text-text-muted" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-text-secondary" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm motion-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-bg-panel border border-stadium-border rounded-lg shadow-2xl flex flex-col overflow-hidden max-h-[420px] motion-command-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stadium-border/60">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, zones, or module navigation..."
            className="w-full bg-transparent text-text-primary text-xs focus:outline-none placeholder:text-text-muted"
            aria-label="Search operational actions"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-bg-secondary text-text-muted border border-stadium-border rounded text-[9px] font-mono leading-none">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-1 divide-y divide-stadium-border/10">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-text-muted">
              No operational commands match your query.
            </div>
          ) : (
            filteredCommands.map((cmd: AppCommand, idx: number) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => {
                    cmd.execute();
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition-all duration-150 focus:outline-none ${
                    isSelected
                      ? 'bg-stadium-accent/15 border-l-4 border-stadium-accent pl-3'
                      : 'hover:bg-bg-secondary/65 pl-4'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">
                      {Icon ? <Icon className="w-3.5 h-3.5 text-text-secondary" /> : getCategoryIcon(cmd.category)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-text-primary truncate">{cmd.label}</div>
                      {cmd.description && (
                        <div className="text-[10px] text-text-muted truncate mt-0.5">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <kbd className="px-1.5 py-0.5 bg-bg-secondary text-text-muted border border-stadium-border/60 rounded text-[9px] font-mono leading-none">
                      {cmd.shortcut.label}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Console status footer */}
        <div className="px-4 py-2 bg-bg-secondary border-t border-stadium-border/60 text-[9px] text-text-muted flex items-center justify-between">
          <div className="flex gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>StadiumOps Console Power-User Mode</span>
        </div>
      </div>
    </div>
  );
};
