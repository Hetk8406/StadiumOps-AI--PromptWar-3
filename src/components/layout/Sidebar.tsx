/**
 * Sidebar Component
 * Operations navigation sidebar with smooth collapse transitions,
 * mobile drawer animation, and active link highlighting.
 */

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, AlertTriangle, Users, Activity, MessageSquare, Accessibility, FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../config/constants';
import { Button } from '../ui/Button';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps): React.JSX.Element {
  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Incidents', path: ROUTES.INCIDENTS, icon: AlertTriangle },
    { name: 'Volunteers', path: ROUTES.VOLUNTEERS, icon: Users },
    { name: 'Crowd Flow', path: ROUTES.CROWD, icon: Activity },
    { name: 'Comms Hub', path: ROUTES.COMMUNICATIONS, icon: MessageSquare },
    { name: 'Accessibility', path: ROUTES.ACCESSIBILITY, icon: Accessibility },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  ];

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
    <div className="flex flex-col h-full bg-bg-panel text-text-primary select-none">
      {/* Premium Desktop Sidebar Brand Header */}
      <div className="flex items-center gap-3 px-6 py-4.5 border-b border-stadium-border/60">
        <div className="w-7 h-7 bg-stadium-accent rounded flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
          SO
        </div>
        {!isCollapsed && (
          <span className="font-extrabold tracking-widest text-xs text-text-primary uppercase truncate">
            STADIUMOPS AI
          </span>
        )}
      </div>

      {/* Header for Mobile Drawer Mode only */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-stadium-border">
        <span className="font-bold tracking-wider text-sm text-stadium-accent">STADIUMOPS AI</span>
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
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
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

      {/* Collapse Action Toggle Buttons (Desktop only) */}
      <div className="hidden md:block p-4 border-t border-stadium-border">
        <Button
          variant="outline"
          onClick={onToggleCollapse}
          className="w-full justify-center p-2 text-text-secondary"
          aria-label={isCollapsed ? 'Expand sidebar panel' : 'Collapse sidebar panel'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
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
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
