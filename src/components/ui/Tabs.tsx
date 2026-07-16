/**
 * Tabs Component
 * Reusable tab switcher with underline indicator transition.
 */

import React from 'react';

interface TabOption {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabOption[];
  activeTabId: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTabId, onChange }: TabsProps): React.JSX.Element {
  return (
    <div className="border-b border-stadium-border mb-4">
      <div role="tablist" className="flex space-x-6" aria-label="Command section tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-sm font-semibold tracking-wide border-b-2 motion-focus-ring focus:outline-none transition-colors duration-150 ${
                isActive
                  ? 'border-stadium-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTabId: string;
  children: React.ReactNode;
}

export function TabPanel({ id, activeTabId, children }: TabPanelProps): React.JSX.Element | null {
  if (id !== activeTabId) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className="focus:outline-none motion-fade-in"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
