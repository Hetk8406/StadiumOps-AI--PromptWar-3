import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { ROUTES } from '../../config/constants';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useDashboard, useDecisionSupportAI } from '../../state';

export default function DashboardPage(): React.JSX.Element {
  const { summary, fetchSummary, fetchActivities } = useDashboard();
  const { briefing, loading: analyzing, error: aiError, generateBriefing } = useDecisionSupportAI();

  // Local state for interactive gate details
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'FIFA 2026 Command Center - Operations';
    fetchSummary();
    fetchActivities();
  }, [fetchSummary, fetchActivities]);

  const data = summary.data;

  const handleGenerateBriefing = () => {
    if (!data) return;
    generateBriefing({
      incidentRisk: { active: data.incidents.active, critical: data.incidents.critical },
      volunteerAllocations: { totalDuty: data.volunteers.onDuty, total: data.volunteers.total },
      crowdCongestion: { occupancy: data.attendance.occupancyRate },
      accessibilityIssues: { active: data.accessibility.activeRequests },
    });
  };

  if (summary.loading || !data) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto p-4 animate-pulse" aria-busy="true">
        <div className="h-16 bg-[#14171d] border border-white/[0.05] rounded-xl" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-[#14171d] border border-white/[0.05] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-96 bg-[#14171d] border border-white/[0.05] rounded-xl" />
          <div className="h-96 bg-[#14171d] border border-white/[0.05] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-2 pb-16">
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#14171d] border border-white/[0.04] p-5 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#10b981]/30 transition-all duration-300">
          <span className="text-[9px] uppercase tracking-widest text-[#9ca3af] font-bold">Security Status</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-[#10b981] tracking-tight uppercase">Secure</span>
            <span className="text-[10px] text-[#9ca3af] font-mono">LVL 01</span>
          </div>
          <div className="absolute right-4 bottom-4 w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
        </Card>

        <Card className="bg-[#14171d] border border-white/[0.04] p-5 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#d4af37]/30 transition-all duration-300">
          <span className="text-[9px] uppercase tracking-widest text-[#9ca3af] font-bold">Stadium Occupancy</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{data.attendance.occupancyRate}%</span>
            <span className="text-[10px] text-[#d4af37] font-bold">+1.4%</span>
          </div>
          <div className="absolute right-4 bottom-4 text-xs text-[#9ca3af] font-mono">
            {data.attendance.total} / {data.attendance.capacity}
          </div>
        </Card>

        <Card className="bg-[#14171d] border border-white/[0.04] p-5 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#3b82f6]/30 transition-all duration-300">
          <span className="text-[9px] uppercase tracking-widest text-[#9ca3af] font-bold">Medical Units</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">18/20</span>
            <span className="text-[9px] text-[#3b82f6] uppercase tracking-wider font-extrabold bg-[#3b82f6]/10 px-1.5 py-0.5 rounded">Active</span>
          </div>
          <div className="absolute right-4 bottom-4 text-xs text-[#9ca3af] font-mono">
            2 Standby
          </div>
        </Card>

        <Card className="bg-[#14171d] border border-white/[0.04] p-5 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#10b981]/30 transition-all duration-300">
          <span className="text-[9px] uppercase tracking-widest text-[#9ca3af] font-bold">Fire Safety</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">Ready</span>
            <span className="text-[10px] text-[#10b981] font-bold">✓ Verified</span>
          </div>
          <div className="absolute right-4 bottom-4 w-4.5 h-4.5 bg-[#10b981]/15 rounded flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
          </div>
        </Card>
      </div>

      {/* 2. MAIN HUB SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#14171d] border border-white/[0.04] p-6 flex flex-col h-[520px] relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold">LIVE VISUALIZATION</span>
                <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">Stadia Density Heatmap</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9.5px] uppercase tracking-widest text-[#ef4444] font-bold font-mono">LIVE STATS</span>
              </div>
            </div>

            <div className="flex-1 bg-[#0a0b0d] rounded-xl border border-white/[0.03] flex items-center justify-center p-4 relative overflow-hidden">
              <div className="w-[85%] h-[75%] border-2 border-white/10 rounded-lg relative flex items-center justify-center">
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/10" />
                <div className="w-28 h-28 rounded-full border-2 border-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[15%] border-2 border-l-0 border-white/10" />
                <div className="absolute right-0 top-1/4 bottom-1/4 w-[15%] border-2 border-r-0 border-white/10" />
                <div className="absolute -top-3 left-4 right-4 h-6 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded backdrop-blur-sm flex items-center justify-center text-[9px] font-black text-[#ef4444] tracking-widest uppercase">
                  NORTH TIER // {data.attendance.occupancyRate}%
                </div>
                <div className="absolute -bottom-3 left-4 right-4 h-6 bg-[#f59e0b]/20 border border-[#f59e0b]/40 rounded backdrop-blur-sm flex items-center justify-center text-[9px] font-black text-[#f59e0b] tracking-widest uppercase">
                  SOUTH TIER // 72%
                </div>
                <div className="absolute -left-3 top-12 bottom-12 w-6 bg-[#10b981]/20 border border-[#10b981]/40 rounded backdrop-blur-sm flex items-center justify-center text-[9px] font-black text-[#10b981] tracking-widest uppercase writing-vertical">
                  EAST TIER // OPTIMAL
                </div>
                <div className="absolute -right-3 top-12 bottom-12 w-6 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded backdrop-blur-sm flex items-center justify-center text-[9px] font-black text-[#ef4444] tracking-widest uppercase writing-vertical">
                  WEST TIER // DENSE
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/[0.04]">
              {[
                { gate: 'Gate 12', capacity: '720/hr', value: '75%', color: '#ef4444' },
                { gate: 'Gate 08', capacity: '450/hr', value: '45%', color: '#10b981' },
                { gate: 'Gate 15', capacity: '910/hr', value: '91%', color: '#ef4444' },
                { gate: 'Gate 22', capacity: '280/hr', value: '28%', color: '#f59e0b' },
              ].map((gt, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center p-3 rounded-lg border border-white/[0.03] bg-[#0a0b0d]/50 hover:bg-[#0a0b0d] transition-all cursor-pointer ${
                    selectedGate === gt.gate ? 'border-[#d4af37]/40 ring-1 ring-[#d4af37]/20' : ''
                  }`}
                  onClick={() => setSelectedGate(gt.gate === selectedGate ? null : gt.gate)}
                >
                  <span className="text-[10px] font-bold text-white">{gt.gate}</span>
                  <div className="relative w-12 h-12 my-2 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.03)" strokeWidth="3" fill="transparent" />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke={gt.color}
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={125}
                        strokeDashoffset={125 - (125 * parseInt(gt.value)) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[8.5px] font-bold text-white font-mono">{gt.value}</span>
                  </div>
                  <span className="text-[9px] text-[#9ca3af] font-mono">{gt.capacity}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#14171d] border border-white/[0.04] p-5 flex flex-col justify-between h-[230px] relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold">Broadcast Sync</span>
                <h3 className="text-sm font-bold text-white mt-0.5">FEED_04_MAIN</h3>
              </div>
              <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-500 font-extrabold px-1.5 py-0.5 rounded font-mono">
                LIVE 42:18
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-3 relative">
              <svg
                className="w-16 h-16 text-[#d4af37]/15 group-hover:scale-110 transition-transform duration-500"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M50 5L15 20V50C15 75 50 95 50 95C50 95 85 75 85 50V20L50 5Z" stroke="currentColor" strokeWidth="8" />
                <path d="M50 25L35 60M50 25L65 60" stroke="#f9fafb" strokeWidth="6" />
                <path d="M40 48H60M50 25V75" stroke="currentColor" strokeWidth="6" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[9.5px] text-[#9ca3af] font-mono mt-2 pt-2 border-t border-white/[0.04]">
              <span>Resolution: 1080p // 60fps</span>
              <span className="text-[#10b981] font-bold">● CONNECTED</span>
            </div>
          </Card>

          <Card className="bg-[#14171d] border border-white/[0.04] p-5 h-[266px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
              <span className="text-[10px] uppercase tracking-wider text-white font-extrabold">Recent Incident Log</span>
              <Link to={ROUTES.INCIDENTS} className="text-[9.5px] text-[#d4af37] font-bold hover:underline flex items-center">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto mt-3 space-y-3.5 pr-1 text-[11px] leading-relaxed">
              <div className="border-l-2 border-[#d4af37] pl-3 py-0.5">
                <span className="text-[9px] text-[#9ca3af] block font-mono">14:22:05 – PROTOCOL</span>
                <p className="text-white font-semibold mt-0.5">VIP Arrival: Delegation from FIFA Zurich arriving at North Gate.</p>
              </div>
              <div className="border-l-2 border-[#10b981] pl-3 py-0.5">
                <span className="text-[9px] text-[#9ca3af] block font-mono">14:15:30 – SECURITY</span>
                <p className="text-white font-semibold mt-0.5">Crowd flow normalized at East Gate after initial surge.</p>
              </div>
              <div className="border-l-2 border-[#ef4444] pl-3 py-0.5">
                <span className="text-[9px] text-[#9ca3af] block font-mono">14:02:44 – ALERT</span>
                <p className="text-white font-semibold mt-0.5">Unauthorized access attempt flagged at Perimeter C, Zone 4.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. COOPERATIVE AI INTELLIGENCE SYSTEM */}
      <Card className="bg-[#14171d]/90 border border-[#d4af37]/20 shadow-[0_0_50px_-12px_rgba(212,175,55,0.06)] p-6 space-y-5 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.04] pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-md">
              <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-[#d4af37] uppercase tracking-widest font-black block">AI Oracle Engine</span>
              <h2 className="text-sm font-bold text-white tracking-tight mt-0.5">Decision Briefing Formulation</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {briefing && (
              <span className="text-[10px] text-[#9ca3af] mr-3 tracking-wider uppercase font-bold font-mono">
                Telemetry Status: <strong className={`font-extrabold ${
                  briefing.overallStatus === 'RED' ? 'text-[#ef4444]' :
                  briefing.overallStatus === 'ORANGE' ? 'text-[#f59e0b]' : 'text-[#10b981]'
                }`}>{briefing.overallStatus}</strong>
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border border-[#d4af37]/30 hover:bg-[#d4af37]/10 text-white font-bold tracking-wider text-[10px] uppercase shadow-sm transition-all duration-150 rounded"
              onClick={handleGenerateBriefing}
              disabled={analyzing}
            >
              {analyzing ? 'Synthesizing logs...' : briefing ? 'Re-Analyze Logs' : 'Synthesize Logs'}
            </Button>
          </div>
        </div>

        {analyzing ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center justify-center gap-4">
            <RefreshCw className="w-9 h-9 text-[#d4af37] animate-spin" />
            <span className="font-semibold text-white">Formulating executive intelligence brief across stadium parameters...</span>
            <p className="text-[11px] text-[#9ca3af] max-w-lg leading-relaxed">Checking logs for active medical dispatch tickets, crowd flow velocity, available staff metrics, and system node health telemetry.</p>
          </div>
        ) : aiError ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-500 flex items-center justify-between text-xs font-mono">
            <span><strong>Briefing Formulation Failed:</strong> {aiError}</span>
            <Button variant="outline" size="sm" onClick={handleGenerateBriefing} className="text-red-500 hover:bg-red-500/10">Retry</Button>
          </div>
        ) : briefing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 leading-relaxed">
            
            <div className="lg:col-span-2 space-y-3 bg-[#0a0b0d] p-5 rounded-lg border border-white/[0.03]">
              <strong className="block text-[#d4af37] uppercase text-[9px] tracking-wide mb-1 font-bold">Executive Intelligence Summary</strong>
              <p className="text-white text-xs leading-relaxed font-sans">{briefing.executiveSummary}</p>
            </div>

            <div className="space-y-3 bg-[#0a0b0d] p-5 rounded-lg border border-white/[0.03]">
              <strong className="block text-[#9ca3af] uppercase text-[9px] tracking-wide mb-1 font-bold font-mono">Coordinated Recommendations</strong>
              <div className="space-y-3">
                {briefing.coordinatedRecommendations.map((rec, i) => (
                  <div key={i} className="bg-[#14171d] p-3 rounded border border-white/[0.03] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-[10.5px]">{rec.title}</span>
                      <Badge variant={rec.priority === 'IMMEDIATE' || rec.priority === 'HIGH' ? 'danger' : 'warning'}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-[#d4af37] font-semibold">{rec.action}</p>
                    <p className="text-[10px] text-[#9ca3af] leading-normal">{rec.rationalExplanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center border border-dashed border-white/[0.08] rounded-xl bg-[#0a0b0d]/50 text-[#9ca3af]">
            System ready for cross-module analysis. Click "Synthesize Logs" to initiate Gemini Decision Support.
          </div>
        )}
      </Card>

      {/* 4. CRITICAL OPERATIONAL ALERTS */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Critical Operational Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="p-5 border-l-2 border-[#f59e0b] bg-[#14171d] rounded-r-xl shadow-subtle flex items-start space-x-3">
            <div>
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">Weather Advisory</div>
              <div className="text-[11px] text-[#9ca3af] mt-1.5 leading-relaxed">
                Temp: {data.weather.tempCelsius}°C - {data.weather.condition}. Wind: {data.weather.windSpeed}.
              </div>
            </div>
          </div>
          <div className="p-5 border-l-2 border-[#ef4444] bg-[#14171d] rounded-r-xl shadow-subtle flex items-start space-x-3">
            <div>
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">Transport Delay</div>
              <div className="text-[11px] text-[#9ca3af] mt-1.5 leading-relaxed font-sans">Train line 4 suspended. Bus shuttles rerouted.</div>
            </div>
          </div>
          <div className="p-5 border-l-2 border-[#d4af37] bg-[#14171d] rounded-r-xl shadow-subtle flex items-start space-x-3">
            <div>
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">Security Notice</div>
              <div className="text-[11px] text-[#9ca3af] mt-1.5 leading-relaxed font-sans">Active alerts today: {data.broadcasts.activeAlerts}.</div>
            </div>
          </div>
          <div className="p-5 border-l-2 border-[#3b82f6] bg-[#14171d] rounded-r-xl shadow-subtle flex items-start space-x-3">
            <div>
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">Accessibility Notice</div>
              <div className="text-[11px] text-[#9ca3af] mt-1.5 leading-relaxed font-sans">Active requests queue: {data.accessibility.activeRequests}.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
