/**
 * Header Component
 * Global command center header with page title transition.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, SunMoon } from 'lucide-react';
import NotificationCenter from '../notifications/NotificationCenter';
import { APP_CONFIG } from '../../config/constants';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps): React.JSX.Element {
  const location = useLocation();

  const getPageTitle = () => {
    const segment = location.pathname.split('/').filter(Boolean)[0];
    if (!segment) return 'Home Overview';
    const titles: Record<string, string> = {
      incidents: 'Incident Analysis Room',
      volunteers: 'Volunteer Dispatch Center',
      crowd: 'Crowd Intelligence',
      communications: 'Multilingual Comms Hub',
      accessibility: 'Accessibility Assistance',
      reports: 'Incident Logs & Reports',
      settings: 'Console Settings',
    };
    return titles[segment] || 'Command Center';
  };

  return (
    <header className="bg-bg-secondary border-b border-stadium-border h-16 px-6 flex items-center justify-between z-30 select-none">
      {/* Brand Logo & Mobile Toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-md motion-focus-ring focus:outline-none focus:ring-2 focus:ring-stadium-accent transition-colors"
          aria-label="Toggle navigation navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-stadium-gold-600 rounded flex items-center justify-center font-black text-bg-primary text-sm shadow-subtle">
            FWC
          </div>
          <span className="hidden sm:inline-block font-bold text-sm tracking-widest text-text-primary uppercase">
            {APP_CONFIG.name.split('–')[0]}
          </span>
        </div>
      </div>

      {/* Header Search Box */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
        <input
          type="search"
          placeholder="Global operational search (incidents, personnel, zones)..."
          className="w-full bg-bg-primary text-text-primary text-xs pl-10 pr-4 py-2 border border-stadium-border rounded-md motion-form-focus focus:outline-none focus:ring-2 focus:ring-stadium-accent placeholder:text-text-muted"
          aria-label="Global console search"
        />
      </div>

      {/* Active Panel Title and Icons */}
      <div className="flex items-center space-x-4">
        <h2 className="hidden md:block text-sm font-semibold border-r border-stadium-border pr-4 mr-2 text-text-secondary">
          {getPageTitle()}
        </h2>

        <Button
          variant="outline"
          size="sm"
          className="p-2 border-none hover:bg-bg-panel text-text-secondary"
          aria-label="Toggle high contrast accessibility theme mode"
        >
          <SunMoon className="w-4 h-4" />
        </Button>

        <div className="relative">
          <NotificationCenter />
        </div>

        <div className="flex items-center space-x-2 border-l border-stadium-border pl-4">
          <div className="w-8 h-8 rounded-full bg-stadium-accent text-white flex items-center justify-center font-bold text-xs">
            OP
          </div>
          <span className="hidden xl:block text-xs font-semibold text-text-secondary">
            OPERATOR-26
          </span>
        </div>
      </div>
    </header>
  );
}
