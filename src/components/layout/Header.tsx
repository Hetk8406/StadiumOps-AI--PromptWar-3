import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Search, User, Settings } from 'lucide-react';
import NotificationCenter from '../notifications/NotificationCenter';
import { ROUTES } from '../../config/constants';

export default function Header(): React.JSX.Element {
  const location = useLocation();

  const navItems = [
    { name: 'Operations', path: ROUTES.DASHBOARD },
    { name: 'Match Day', path: ROUTES.CROWD },
    { name: 'Security', path: ROUTES.INCIDENTS },
    { name: 'Logistics', path: ROUTES.VOLUNTEERS },
    { name: 'Comms', path: ROUTES.COMMUNICATIONS },
    { name: 'Accessibility', path: ROUTES.ACCESSIBILITY },
    { name: 'Analytics', path: '/reports' },
    { name: 'Settings', path: ROUTES.SETTINGS },
  ];

  return (
    <header className="bg-[#080a0f] border-b border-white/[0.04] h-24 pt-4 px-8 flex items-center justify-between z-30 select-none w-full shrink-0">
      {/* Left side: Premium Shield Logo & Brand name */}
      <div className="flex items-center space-x-3 shrink-0">
        <svg
          className="w-9 h-9"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gold Shield Outer */}
          <path
            d="M50 8L82 22V50C82 72 50 90 50 90C50 90 18 72 18 50V22L50 8Z"
            stroke="#d4af37"
            strokeWidth="5.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Inner monogram arch */}
          <path
            d="M32 48C32 48 40 38 50 38C60 38 68 48 68 48"
            stroke="#f3f4f6"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Vertical central pillar */}
          <path
            d="M50 38V68"
            stroke="#d4af37"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Base structure support lines */}
          <path
            d="M35 56L50 71L65 56"
            stroke="#d4af37"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex flex-col">
          <span className="font-sans font-black tracking-[0.2em] text-[10.5px] text-white leading-none">FIFA 2026</span>
          <span className="font-sans font-light tracking-[0.3em] text-[8px] text-[#d4af37] leading-none mt-1">COMMAND</span>
        </div>
      </div>

      {/* Center Section: Navigation tabs */}
      <nav className="flex items-center space-x-2" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2.5 rounded-lg text-[10px] font-bold tracking-[0.15em] transition-all duration-300 uppercase whitespace-nowrap ${
                isActive
                  ? 'text-white bg-white/[0.03] border border-white/[0.08]'
                  : 'text-[#9ca3af] border border-transparent hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-[-13px] left-1/2 -translate-x-1/2 w-4 h-[3px] bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Right side: Search, Notification Badge & Profile/Settings icons */}
      <div className="flex items-center space-x-4 shrink-0">
        <button
          className="p-2 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all"
          aria-label="Search Console"
        >
          <Search className="w-4 h-4" />
        </button>

        <div className="relative shrink-0 p-1 hover:bg-white/[0.03] rounded-lg transition-all">
          <NotificationCenter />
        </div>

        <button
          className="p-2 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all"
          aria-label="User profile panel"
        >
          <User className="w-4 h-4" />
        </button>

        <button
          className="p-2 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all"
          aria-label="System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
