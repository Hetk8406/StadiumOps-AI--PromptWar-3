import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Settings, Menu } from 'lucide-react';
import NotificationCenter from '../notifications/NotificationCenter';
import { ROUTES } from '../../config/constants';
import { pushToast } from '../../notifications/notificationService';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    // Programmatically dispatch Ctrl+K event to open command palette
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      code: 'KeyK',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  const handleProfileClick = () => {
    pushToast('Operator Session Info', 'User: Chief of Tournament Operations (Role: ADMIN). Node ID: TO-1082.', 'info');
  };

  const handleSettingsClick = () => {
    navigate(ROUTES.SETTINGS);
  };

  return (
    <header className="bg-[#080a0f] border-b border-white/[0.04] h-20 px-8 flex items-center justify-between z-30 select-none w-full shrink-0">
      {/* Left side: Mobile menu toggle */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all mr-1 focus:outline-none focus:ring-1 focus:ring-stadium-accent"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Center Section: Spacer/Decorative line */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>

      {/* Right side: Search, Notification Badge & Profile/Settings icons */}
      <div className="flex items-center space-x-4 shrink-0">
        <button
          onClick={handleSearchClick}
          className="p-2.5 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-stadium-accent"
          aria-label="Search Console (Ctrl + K)"
        >
          <Search className="w-6 h-6" />
        </button>

        <div className="relative shrink-0 p-1 hover:bg-white/[0.03] rounded-lg transition-all">
          <NotificationCenter />
        </div>

        <button
          onClick={handleProfileClick}
          className="p-2.5 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-stadium-accent"
          aria-label="User profile panel"
        >
          <User className="w-6 h-6" />
        </button>

        <button
          onClick={handleSettingsClick}
          className="p-2.5 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-stadium-accent"
          aria-label="System Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
