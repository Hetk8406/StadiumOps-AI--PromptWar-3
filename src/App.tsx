import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './config/constants';
import DashboardLayout from './components/layout/DashboardLayout';
import Loading from './components/ui/Loading';
import { AppProvider } from './state';
import { AIProvider } from './ai';
import { CommandProvider } from './command/CommandProvider';
import { CommandPalette } from './components/commandPalette/CommandPalette';
import { KeyboardHelpOverlay } from './components/commandPalette/KeyboardHelpOverlay';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { PageTransition } from './motion/PageTransition';

// Lazy loading views for optimized initial load performance
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const IncidentsPage = lazy(() => import('./features/incidents/IncidentsPage'));
const VolunteersPage = lazy(() => import('./features/volunteers/VolunteersPage'));
const CrowdPage = lazy(() => import('./features/crowd/CrowdPage'));
const CommunicationsPage = lazy(() => import('./features/communications/CommunicationsPage'));
const AccessibilityPage = lazy(() => import('./features/accessibility/AccessibilityPage'));
const ReportsPage = lazy(() => import('./features/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const NotFoundPage = lazy(() => import('./features/notfound/NotFoundPage'));

/**
 * Main App Router and Layout assembly configuration
 */
export default function App(): React.JSX.Element {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Bind global command shortcut trigger listeners
  useKeyboardShortcuts();

  // Custom key hook specifically for Command Palette triggering via Ctrl+K or ? (Help)
  useEffect(() => {
    const handleTriggerKeys = (e: KeyboardEvent) => {
      // Ignore keybindings inside editable text elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsPaletteOpen((o) => !o);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsHelpOpen((o) => !o);
      }
    };

    window.addEventListener('keydown', handleTriggerKeys);
    return () => window.removeEventListener('keydown', handleTriggerKeys);
  }, []);

  return (
    <AIProvider>
      <AppProvider>
        <CommandProvider openPalette={() => setIsPaletteOpen(true)} openHelp={() => setIsHelpOpen(true)}>
          <DashboardLayout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path={ROUTES.DASHBOARD} element={<PageTransition><DashboardPage /></PageTransition>} />
                <Route path={ROUTES.INCIDENTS} element={<PageTransition><IncidentsPage /></PageTransition>} />
                <Route path={ROUTES.VOLUNTEERS} element={<PageTransition><VolunteersPage /></PageTransition>} />
                <Route path={ROUTES.CROWD} element={<PageTransition><CrowdPage /></PageTransition>} />
                <Route path={ROUTES.COMMUNICATIONS} element={<PageTransition><CommunicationsPage /></PageTransition>} />
                <Route path={ROUTES.ACCESSIBILITY} element={<PageTransition><AccessibilityPage /></PageTransition>} />
                <Route path="/reports" element={<PageTransition><ReportsPage /></PageTransition>} />
                <Route path={ROUTES.SETTINGS} element={<PageTransition><SettingsPage /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
              </Routes>
            </Suspense>
          </DashboardLayout>

          {/* Core Power User Components */}
          <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
          <KeyboardHelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </CommandProvider>
      </AppProvider>
    </AIProvider>
  );
}
