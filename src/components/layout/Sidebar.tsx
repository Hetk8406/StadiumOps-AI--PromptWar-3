import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, AlertTriangle, Users, Activity, MessageSquare, Accessibility, FileText, Settings, Search, BellRing, User } from 'lucide-react';
import { ROUTES } from '../../config/constants';
import { Button } from '../ui/Button';
import NotificationCenter from '../notifications/NotificationCenter';
import { useNotifications } from '../../notifications/useNotifications';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse: _onToggleCollapse,
}: SidebarProps): React.JSX.Element {
  const { unreadCount } = useNotifications();

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Incidents', path: ROUTES.INCIDENTS, icon: AlertTriangle },
    { name: 'Volunteers', path: ROUTES.VOLUNTEERS, icon: Users },
    { name: 'Crowd Flow', path: ROUTES.CROWD, icon: Activity },
    { name: 'Comms Hub', path: ROUTES.COMMUNICATIONS, icon: MessageSquare },
    { name: 'Accessibility', path: ROUTES.ACCESSIBILITY, icon: Accessibility },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onMobileClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onMobileClose]);

  const sidebarContent = (
    <div 
      className="flex flex-col justify-between h-screen bg-bg-panel text-text-primary select-none"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}
    >
      {/* Top Section wrapper */}
      <div className="flex flex-col min-h-0">
        {/* Premium Desktop Sidebar Brand Header */}
        <div 
          className="flex items-center gap-[0.75rem] py-6 px-4"
          style={{ borderBottom: '1px solid #222' }}
        >
          <div className="w-7 h-7 bg-stadium-accent rounded flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
            FC
          </div>
          {!isCollapsed && (
            <span className="font-bold tracking-wider text-[11px] text-text-primary uppercase truncate">
              FIFA 2026 COMMAND
            </span>
          )}
        </div>

        {/* Header for Mobile Drawer Mode only */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-stadium-border">
          <span className="font-bold tracking-wider text-sm text-stadium-accent">FIFA 2026 COMMAND</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onMobileClose}
            aria-label="Close navigation drawer"
            className="p-1 min-w-[32px]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Nav List links */}
        <nav className="p-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center rounded-md text-xs font-semibold uppercase tracking-wider motion-focus-ring focus:outline-none focus:ring-1 focus:ring-stadium-accent transition-all duration-150 ${
                  isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-bg-secondary text-stadium-accent border-l-4 border-stadium-accent pl-2'
                    : 'text-text-secondary hover:bg-bg-secondary/40 hover:text-text-primary'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Utility Panel */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '1rem 0.5rem',
          borderTop: '1px solid #222',
          marginTop: 'auto'
        }}
        className="shrink-0"
      >
        {/* Search */}
        <button
          onClick={handleSearchClick}
          className="text-[#9ca3af] hover:text-stadium-accent transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-stadium-accent rounded p-1"
          aria-label="Search Console (Ctrl + K)"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification */}
        <div className="relative">
          <NotificationCenter trigger={
            <button
              className="relative text-[#9ca3af] hover:text-stadium-accent transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-stadium-accent rounded p-1"
              aria-label={`Notifications — ${unreadCount} unread`}
            >
              <BellRing className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-full bg-stadium-critical text-[8px] font-bold text-white px-0.5 leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          } />
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text-[#9ca3af] hover:text-stadium-accent transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-stadium-accent rounded p-1 ${
              isActive ? 'text-stadium-accent' : ''
            }`
          }
          aria-label="User Profile"
        >
          <User className="w-5 h-5" />
        </NavLink>

        {/* Settings */}
        <NavLink
          to={ROUTES.SETTINGS}
          className={({ isActive }) =>
            `text-[#9ca3af] hover:text-stadium-accent transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-stadium-accent rounded p-1 ${
              isActive ? 'text-stadium-accent' : ''
            }`
          }
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE DRAWER DIALOG PORTAL */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm motion-panel-slide md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:hidden motion-panel-slide transform bg-bg-panel ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {sidebarContent}
      </div>

      {/* DESKTOP PERMANENT / COLLAPSIBLE SIDEBAR PANEL */}
      <aside
        className={`hidden md:flex flex-col border-r border-stadium-border transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-[260px]'
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: isCollapsed ? '80px' : '260px',
          zIndex: 40
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
