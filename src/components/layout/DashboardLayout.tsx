import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import ErrorBoundary from '../ui/ErrorBoundary';
import ToastContainer from '../notifications/ToastContainer';
import { pushNotification, pushToast } from '../../notifications/notificationService';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {

  // Seed initial operational notifications on first mount
  useEffect(() => {
    pushNotification('Medical Emergency Active', 'INC-402 — Gate C concourse, medical team dispatched.', 'critical', 'incidents');
    pushNotification('AI Analysis Available', 'Crowd redistribution recommendations generated for Zone F.', 'info', 'ai');
    pushNotification('Volunteer Deployment Updated', 'Section B-4 has been reinforced with 3 additional marshals.', 'success', 'volunteers');
    pushToast('Command Center Online', 'All 9 operational systems connected.', 'success');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary overflow-hidden relative pb-16">
      {/* Skip-to-Content bypass accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-bg-primary px-4 py-2 font-bold rounded z-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
      >
        Skip to Main Content
      </a>

      {/* Header Bar */}
      <Header />

      {/* Main Panel Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content Panel Box */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            id="main-content"
            className="flex-1 overflow-y-auto p-8 focus:outline-none pb-24"
            tabIndex={-1}
          >
            <ErrorBoundary>
              {/* Dynamic Path Breadcrumbs */}
              <Breadcrumb />
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
