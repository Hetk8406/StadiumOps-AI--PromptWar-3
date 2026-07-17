import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ErrorBoundary from '../ui/ErrorBoundary';
import ToastContainer from '../notifications/ToastContainer';
import { pushNotification, pushToast } from '../../notifications/notificationService';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Seed initial operational notifications on first mount
  useEffect(() => {
    pushNotification('Medical Emergency Active', 'INC-402 — Gate C concourse, medical team dispatched.', 'critical', 'incidents');
    pushNotification('AI Analysis Available', 'Crowd redistribution recommendations generated for Zone F.', 'info', 'ai');
    pushNotification('Volunteer Deployment Updated', 'Section B-4 has been reinforced with 3 additional marshals.', 'success', 'volunteers');
    pushToast('Command Center Online', 'All 9 operational systems connected.', 'success');
  }, []);

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary overflow-hidden relative">
      {/* Skip-to-Content bypass accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-bg-primary px-4 py-2 font-bold rounded z-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
      >
        Skip to Main Content
      </a>

      {/* Navigation Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area Container */}
      <div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-16 transition-all duration-200 ease-in-out"
        style={{ marginLeft: isDesktop ? (isCollapsed ? '80px' : '260px') : '0px' }}
      >
        {/* Content Box */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            id="main-content"
            className="flex-1 overflow-y-auto p-8 focus:outline-none pb-24"
            tabIndex={-1}
          >
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>

          {/* Footer Bar */}
          <Footer />
        </div>
      </div>

      {/* Global Toast Notification Portal */}
      <ToastContainer />
    </div>
  );
}
