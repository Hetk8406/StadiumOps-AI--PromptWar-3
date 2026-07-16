import React, { useState, useEffect } from 'react';
import { ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

/**
 * Operations Status Bar (Footer).
 * Includes system status metrics, current runtime version, network connection status,
 * and a synchronized operations UTC clock.
 */
export default function Footer(): React.JSX.Element {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Synchronize current date time clock tick
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Sync online connection state statuses
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <footer
      role="contentinfo"
      className="h-8 bg-bg-secondary border-t border-stadium-border px-6 flex items-center justify-between text-xs text-text-muted"
    >
      {/* System Status Indicators */}
      <div className="flex items-center space-x-4">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-stadium-success" aria-hidden="true" />
          <span className="font-semibold text-text-secondary">StadiumOps SECURE</span>
        </span>
        <span className="h-3 w-px bg-stadium-border" aria-hidden="true" />
        <span className="uppercase tracking-wider font-medium text-[10px]">
          ENV: <strong className="text-text-primary">PROD-SIMULATOR</strong>
        </span>
      </div>

      {/* Version and Clock */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1.5" aria-live="polite">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-stadium-success" aria-hidden="true" />
              <span>Console Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-stadium-critical animate-pulse" aria-hidden="true" />
              <span className="text-stadium-critical font-semibold">Console Offline</span>
            </>
          )}
        </div>
        <span className="h-3 w-px bg-stadium-border" aria-hidden="true" />
        <span>v{APP_CONFIG.version}</span>
        <span className="h-3 w-px bg-stadium-border" aria-hidden="true" />
        <time
          dateTime={currentTime.toISOString()}
          className="font-mono text-text-primary tracking-widest font-semibold"
          aria-label="Operational local time"
        >
          {currentTime.toLocaleTimeString()}
        </time>
      </div>
    </footer>
  );
}
