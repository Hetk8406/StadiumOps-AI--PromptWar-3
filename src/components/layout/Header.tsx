import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps): React.JSX.Element {
  const location = useLocation();

  // Map route path segments to friendly readable names
  const getPageDisplayName = (segment: string) => {
    const names: Record<string, string> = {
      incidents: 'Incidents Feed',
      volunteers: 'Volunteers Core',
      crowd: 'Crowd Operations',
      communications: 'Comms Hub',
      accessibility: 'Accessibility Assistance',
      reports: 'Incident Reports',
      settings: 'Console Settings',
    };
    return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentPage = pathnames[pathnames.length - 1];
  const currentPageName = currentPage ? getPageDisplayName(currentPage) : 'Dashboard';

  return (
    <header 
      className="bg-[#080a0f] h-16 px-6 flex items-center justify-between z-30 select-none w-full shrink-0"
      style={{ borderBottom: '1px solid #222' }}
    >
      {/* Left side: Mobile Toggle & Brand Context with Integrated Breadcrumb */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 text-[#9ca3af] hover:text-white hover:bg-white/[0.03] rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-stadium-accent"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <span className="font-extrabold tracking-widest text-[11px] text-text-primary uppercase">
            STADIUMOPS AI
          </span>
          <span className="text-text-muted/60 text-[10px] font-bold" aria-hidden="true">&gt;</span>
          <span className="text-stadium-accent text-[11px] font-bold uppercase tracking-wider">
            {currentPageName}
          </span>
        </div>
      </div>
    </header>
  );
}
