import React, { useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useDashboard, useDecisionSupportAI } from '../../state';

export default function DashboardPage(): React.JSX.Element {
  const { summary, fetchSummary, fetchActivities } = useDashboard();
  const { briefing, loading: analyzing, error: aiError, generateBriefing } = useDecisionSupportAI();

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
    <div className="space-y-6 max-w-[1600px] mx-auto p-2 pb-16">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* TOP: CRITICAL OPERATIONAL ALERTS HEADLINE BANNER */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Critical Operational Alerts</h2>
        <div className="border border-white/[0.04] bg-[#14171d] p-3.5 rounded-xl overflow-hidden relative flex items-center shadow-subtle">
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase mr-4 shrink-0 z-10">
            CRITICAL TELEMETRY FEED
          </div>
          <div className="flex-1 overflow-hidden relative w-full">
            <div className="animate-marquee text-xs text-[#9ca3af] font-mono select-all">
              <span className="mr-12">● [WEATHER] Temp: {data.weather.tempCelsius}°C - {data.weather.condition} // Wind: {data.weather.windSpeed}</span>
              <span className="mr-12">● [TRANSPORT] Train line 4 suspended. Bus shuttles rerouted.</span>
              <span className="mr-12">● [SECURITY] Active alerts today: {data.broadcasts.activeAlerts}.</span>
              <span className="mr-12">● [ACCESSIBILITY] Active assistance requests queue: {data.accessibility.activeRequests}.</span>
              
              {/* Duplicate the items for seamless infinite scroll loop */}
              <span className="mr-12">● [WEATHER] Temp: {data.weather.tempCelsius}°C - {data.weather.condition} // Wind: {data.weather.windSpeed}</span>
              <span className="mr-12">● [TRANSPORT] Train line 4 suspended. Bus shuttles rerouted.</span>
              <span className="mr-12">● [SECURITY] Active alerts today: {data.broadcasts.activeAlerts}.</span>
              <span className="mr-12">● [ACCESSIBILITY] Active assistance requests queue: {data.accessibility.activeRequests}.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: FULL WIDTH RIBBON STATUS CARDS */}
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

      {/* ROW 2: 70/30 GRID SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left 70% column */}
        <div className="lg:col-span-7">
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
                  WEST TIER // OVERFLOW
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 30% column */}
        <div className="lg:col-span-3">
          <Card className="bg-[#14171d] border border-white/[0.04] p-6 flex flex-col h-[520px] justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold">Activity Ticker</span>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">Live Operations Logs</h2>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto mt-4 pr-1 text-xs text-[#9ca3af]">
              <div className="border-l-2 border-[#d4af37] pl-3 py-0.5">
                <span className="text-[9px] text-[#9ca3af] block font-mono">14:32:01 – SYSTEMS</span>
                <p className="text-white font-semibold mt-0.5">Vite live development sync successful on port 5173.</p>
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

      {/* ROW 3: SECONDARY FULL-WIDTH GRID (AI ORACLE BREIFING) */}
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <Card className="bg-[#14171d]/90 border border-[#d4af37]/20 shadow-[0_0_50px_-12px_rgba(212,175,55,0.06)] p-6 flex flex-col min-h-[380px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.04] pb-4 gap-3 shrink-0">
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

            <div className="flex-1 overflow-y-auto mt-4 pr-1">
              {analyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#9ca3af] gap-4 py-8">
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
                <div className="h-full flex items-center justify-center text-center border border-dashed border-white/[0.08] rounded-xl bg-[#0a0b0d]/50 text-[#9ca3af] py-12">
                  System ready for cross-module analysis. Click "Synthesize Logs" to initiate Gemini Decision Support.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
