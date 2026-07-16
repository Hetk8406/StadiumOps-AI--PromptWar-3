import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

export default function Footer(): React.JSX.Element {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer
      role="contentinfo"
      className="h-10 bg-[#080a0f] border-t border-white/[0.04] px-6 flex items-center justify-between text-[10px] text-[#9ca3af] select-none w-full shrink-0 font-mono"
    >
      {/* Left: Weather and Performance */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-white">24°C | 0.4 m/s</span>
          <span className="text-white/20">|</span>
          <span className="text-[#10b981] font-bold">OPTIMAL [99.8%]</span>
        </div>
      </div>

      {/* Middle: Tactical Incident Counter */}
      <div className="hidden md:flex items-center space-x-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
        <span className="font-bold tracking-widest text-[9.5px]">ACTIVE ALERTS: 03</span>
      </div>

      {/* Right: Console Synced & Time Display */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-[9px] text-[#10b981]" aria-live="polite">
          <Wifi className="w-3.5 h-3.5 text-[#10b981]" aria-hidden="true" />
          <span>CONSOLE SYNCED</span>
        </div>
        <span className="text-white/20">•</span>
        <span className="font-bold tracking-widest">v{APP_CONFIG.version}</span>
        <span className="text-white/20">•</span>
        <time
          dateTime={currentTime.toISOString()}
          className="font-mono text-white tracking-widest font-bold bg-[#14171d] px-2.5 py-1 rounded border border-white/[0.05]"
          aria-label="Operational local time"
        >
          {currentTime.toLocaleTimeString()}
        </time>
      </div>
    </footer>
  );
}
