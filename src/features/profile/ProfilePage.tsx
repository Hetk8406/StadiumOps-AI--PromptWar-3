import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { User, Shield, Server, Clock, Terminal, Activity } from 'lucide-react';

export default function ProfilePage(): React.JSX.Element {
  React.useEffect(() => {
    document.title = 'Operator Profile - StadiumOps AI';
  }, []);

  const sessionLogs = [
    { time: '07:20:15', action: 'Console Session Initialized', module: 'Auth' },
    { time: '07:18:48', action: 'Modified Volunteer Status assignment', module: 'Volunteers' },
    { time: '07:04:46', action: 'Created Incident Log INC-2026-130', module: 'Incidents' },
    { time: '06:40:02', action: 'Synchronized AI Oracle Decision recommendations', module: 'AI-Oracle' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* HEADER */}
      <div className="border-b border-stadium-border pb-6">
        <h1 className="text-h1 font-bold tracking-tight text-text-primary">
          Tournament Operator Profile
        </h1>
        <p className="text-sm text-text-muted mt-1">
          System access clearance credentials and console session telemetry logs.
        </p>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: IDENTITY CARD */}
        <Card className="bg-bg-panel p-6 border border-stadium-border flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-stadium-accent/10 border border-stadium-accent/30 flex items-center justify-center text-stadium-accent">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Chief of Tournament Operations</h2>
            <span className="text-xs text-text-muted font-mono block mt-1">Operator Node ID: TO-1082</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="danger">ADMIN ACCESS</Badge>
            <Badge variant="success">SECURE NODE</Badge>
          </div>
          <div className="w-full border-t border-stadium-border pt-4 text-xs text-left space-y-2 text-text-secondary">
            <div className="flex justify-between">
              <span className="text-text-muted">Assigned Role:</span>
              <strong className="text-text-primary">System Administrator</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Clearance Level:</span>
              <strong className="text-text-primary">Tier-1 Security Control</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Terminal Host:</span>
              <strong className="text-text-primary font-mono">127.0.0.1</strong>
            </div>
          </div>
        </Card>

        {/* MIDDLE COLUMN: telemetry info */}
        <Card className="bg-bg-panel p-6 border border-stadium-border space-y-4 lg:col-span-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-stadium-accent" /> Node Telemetry Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary">
            <div className="bg-[#14171d] p-4 rounded border border-white/[0.02] space-y-1">
              <span className="text-text-muted uppercase text-[9px] font-bold block tracking-wider">Session Key</span>
              <span className="text-text-primary font-mono">STADIUM-OPS-SECURE-KEY-FIFA-2026-X8</span>
            </div>
            <div className="bg-[#14171d] p-4 rounded border border-white/[0.02] space-y-1">
              <span className="text-text-muted uppercase text-[9px] font-bold block tracking-wider">WS Link Gateway</span>
              <span className="text-text-primary font-mono flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-stadium-success" /> SSL-WS DIRECT LINK
              </span>
            </div>
            <div className="bg-[#14171d] p-4 rounded border border-white/[0.02] space-y-1">
              <span className="text-text-muted uppercase text-[9px] font-bold block tracking-wider">Last Sync Check</span>
              <span className="text-text-primary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stadium-success" /> Just Now (UTC sync active)
              </span>
            </div>
            <div className="bg-[#14171d] p-4 rounded border border-white/[0.02] space-y-1">
              <span className="text-text-muted uppercase text-[9px] font-bold block tracking-wider">Subsystem Node Mode</span>
              <span className="text-text-primary flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-stadium-accent" /> MASTER TELEMETRY HUBS
              </span>
            </div>
          </div>

          <div className="border-t border-stadium-border pt-4 space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-stadium-accent" /> Recent Session Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stadium-border bg-[#0a0b0d]/60 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3">Subsystem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02] text-text-secondary">
                  {sessionLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01]">
                      <td className="py-2 px-3 font-mono text-text-muted">{log.time}</td>
                      <td className="py-2 px-3 font-bold text-text-primary">{log.action}</td>
                      <td className="py-2 px-3">
                        <Badge variant="neutral">{log.module}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
