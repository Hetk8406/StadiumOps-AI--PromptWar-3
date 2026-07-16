import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Download,
  Play,
  Search,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCrowd, useCrowdAI } from '../../state';
import { Gate } from '../../domain/models';
import { CrowdStatus, GateStatus } from '../../domain/enums';

/**
 * Crowd Operations & Transit Metrics View.
 * Integrates directly with useCrowd() centralized state and useCrowdAI() decision advisory tools.
 */
export default function CrowdPage(): React.JSX.Element {
  const { zones, gates, fetchZonesAndGates, selectZone, selectedZone } = useCrowd();
  const { recommendations, analyzing, error: aiError, recommendCrowdFlow, clearRecommendations } = useCrowdAI();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Crowd Intelligence - StadiumOps AI';
    fetchZonesAndGates();
  }, [fetchZonesAndGates]);

  // Clear previous recommendations on clean mount or when stands details load
  useEffect(() => {
    clearRecommendations();
  }, [clearRecommendations]);

  const handleRefresh = () => {
    fetchZonesAndGates();
  };

  const statusColors: Record<CrowdStatus, 'neutral' | 'info' | 'warning' | 'danger'> = {
    [CrowdStatus.LOW]: 'neutral',
    [CrowdStatus.MODERATE]: 'info',
    [CrowdStatus.HIGH]: 'warning',
    [CrowdStatus.CRITICAL]: 'danger',
  };

  const gateColors: Record<GateStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
    [GateStatus.OPEN]: 'success',
    [GateStatus.RESTRICTED]: 'warning',
    [GateStatus.CLOSED]: 'danger',
    [GateStatus.EMERGENCY]: 'danger',
  };

  const filteredGates = gates.data?.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stadium-border pb-6">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Crowd Operations
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Observe real-time spectator flow, gate queues wait times, and transit status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-text-secondary" disabled>
            <Play className="w-4 h-4 mr-1.5" /> Simulation
          </Button>
          <Button variant="outline" size="sm" className="text-text-secondary" disabled>
            <Download className="w-4 h-4 mr-1.5" /> Export Logs
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="text-text-secondary">
            <RefreshCw className={`w-4 h-4 ${zones.loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* SUMMARY TELEMETRY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-text-muted uppercase">Total Ingress</div>
          <div className="text-2xl font-extrabold text-text-primary mt-2">74,812</div>
          <p className="text-[10px] text-text-muted mt-1">Total stadium capacity: 82.5k</p>
        </Card>
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-stadium-accent uppercase">Average Ingress</div>
          <div className="text-2xl font-extrabold text-stadium-accent mt-2">72%</div>
          <p className="text-[10px] text-text-muted mt-1">Stands occupancy matches</p>
        </Card>
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-stadium-warning uppercase">Peak Density Zone</div>
          <div className="text-2xl font-extrabold text-stadium-warning mt-2">SOUTH STAND</div>
          <p className="text-[10px] text-stadium-warning font-semibold mt-1">90% Capacity exceeded</p>
        </Card>
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-stadium-success uppercase">Average Wait Time</div>
          <div className="text-2xl font-extrabold text-stadium-success mt-2">6.8 MIN</div>
          <p className="text-[10px] text-text-muted mt-1">Turnstile SLAs maintained</p>
        </Card>
      </div>

      {/* SEARCH AND MAP SPLIT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE MAP & DETAILS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">Stadium Map Overlays</h2>

          {zones.loading ? (
            <div className="h-96 bg-bg-panel border border-stadium-border rounded animate-pulse" />
          ) : (
            <div className="p-4 bg-bg-panel border border-stadium-border rounded flex flex-col md:flex-row gap-6">
              
              {/* STYLISH SVG MAP VECTOR PLOT */}
              <div className="flex-1 max-w-[400px] mx-auto">
                <svg viewBox="0 0 400 400" className="w-full h-auto" aria-label="Stadium interactive stand layout">
                  {/* Outer Concourse Ring */}
                  <rect x="10" y="10" width="380" height="380" rx="190" fill="none" stroke="#2a2e35" strokeWidth="6" />
                  
                  {/* North Stand */}
                  <path
                    d="M 60,60 A 190,190 0 0,1 340,60 L 290,120 A 120,120 0 0,0 110,120 Z"
                    fill={selectedZone?.id === 'zone-north' ? '#8a7620' : '#1e2229'}
                    stroke="#2a2e35"
                    strokeWidth="3"
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => selectZone(zones.data?.find((z) => z.id === 'zone-north') || null)}
                  />
                  
                  {/* South Stand */}
                  <path
                    d="M 60,340 A 190,190 0 0,0 340,340 L 290,280 A 120,120 0 0,1 110,280 Z"
                    fill={selectedZone?.id === 'zone-south' ? '#8a7620' : '#1e2229'}
                    stroke="#2a2e35"
                    strokeWidth="3"
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => selectZone(zones.data?.find((z) => z.id === 'zone-south') || null)}
                  />

                  {/* Pitch Placeholder Center */}
                  <rect x="130" y="150" width="140" height="100" rx="8" fill="#15181f" stroke="#2a2e35" strokeWidth="4" />
                </svg>
              </div>

              {/* DETAILS PANEL HUD */}
              <div className="w-full md:w-[260px] space-y-4">
                {selectedZone ? (
                  <Card className="bg-bg-secondary p-4 space-y-3 border-stadium-border/60">
                    <div>
                      <strong className="text-xs text-text-muted uppercase tracking-wider block">Stand Details</strong>
                      <h3 className="text-sm font-bold text-text-primary mt-1">{selectedZone.name}</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Total Capacity</span>
                        <span className="text-text-primary font-bold">{selectedZone.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Occupancy</span>
                        <span className="text-text-primary font-bold">{selectedZone.currentOccupancy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Status</span>
                        <Badge variant={statusColors[selectedZone.status]}>{selectedZone.status}</Badge>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="text-xs text-text-muted p-4 text-center border border-dashed border-stadium-border rounded">
                    Tap a stadium stand quadrant to inspect telemetry and density meters.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI CROWD ADVISORY SUPPORT */}
          <Card className="bg-bg-panel p-4 space-y-3 text-xs text-text-secondary">
            <div className="flex items-center justify-between border-b border-stadium-border pb-3">
              <span className="font-bold text-stadium-accent uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-stadium-accent" /> AI Crowd Flow redistribution advisory
              </span>
              {recommendations && (
                <span className="text-[10px] text-text-muted">
                  Confidence: <strong className="text-stadium-success">{recommendations.confidenceCategory} ({Math.round(recommendations.confidence * 100)}%)</strong>
                </span>
              )}
            </div>

            {analyzing ? (
              <div className="p-4 bg-bg-secondary border border-stadium-border rounded text-center text-text-muted flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 text-stadium-accent animate-spin" />
                <span>Gemini AI is processing queue lengths and flows rates...</span>
              </div>
            ) : aiError ? (
              <div className="p-3 bg-stadium-critical/10 border border-stadium-critical/30 rounded text-stadium-critical text-xs">
                <strong>Advisory Failed:</strong> {aiError}
                <Button variant="outline" size="sm" onClick={() => recommendCrowdFlow(gates.data || [])} className="w-full mt-2 text-stadium-critical hover:bg-stadium-critical/10">
                  Retry Advisory
                </Button>
              </div>
            ) : recommendations ? (
              <div className="space-y-3 bg-bg-secondary p-3 border border-stadium-border rounded text-[11px] leading-relaxed">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Overall Congestion Risk</strong>
                    <Badge variant={recommendations.congestionRiskLevel === 'CRITICAL' || recommendations.congestionRiskLevel === 'HIGH' ? 'danger' : 'warning'}>
                      {recommendations.congestionRiskLevel}
                    </Badge>
                  </div>
                  <div>
                    <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Predicted Wait Time</strong>
                    <span className="text-text-primary font-bold">{recommendations.predictedWaitTimeMinutes} Min</span>
                  </div>
                </div>

                {recommendations.bottleneckGates.length > 0 && (
                  <div>
                    <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Bottleneck Turnstiles</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recommendations.bottleneckGates.map((gateName, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-stadium-critical/15 text-stadium-critical text-[9px] font-bold">
                          {gateName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">AI Redistribution Advice</strong>
                  <p className="text-text-primary mt-0.5">{recommendations.explanation}</p>
                </div>

                <div>
                  <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Suggested Action Guidelines</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-text-primary">
                    {recommendations.recommendedFlowRedirections.map((redir, i) => (
                      <li key={i}>{redir}</li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" size="sm" onClick={() => recommendCrowdFlow(gates.data || [])} className="w-full text-text-secondary border-dashed mt-2">
                  Refresh Advisory
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => recommendCrowdFlow(gates.data || [])} className="w-full font-semibold border-stadium-accent/40 text-stadium-accent hover:bg-stadium-accent/5">
                Optimize Transit & Flow with Gemini AI
              </Button>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: GATES WAITING QUEUE LIST */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">Gate Telemetry & Queue</h2>

          <div className="p-3 bg-bg-panel border border-stadium-border rounded-md relative flex items-center mb-3">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-6" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Gate name..."
              className="w-full bg-bg-secondary text-text-primary text-xs pl-10 pr-3 py-1.5 border border-stadium-border rounded focus:outline-none"
            />
          </div>

          {gates.loading ? (
            <div className="space-y-3 animate-pulse" aria-busy="true">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-bg-panel border border-stadium-border rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredGates?.map((gate: Gate) => (
                <div key={gate.id} className="p-3.5 bg-bg-panel border border-stadium-border rounded flex items-center justify-between hover:border-stadium-accent transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{gate.name}</h4>
                    <span className="text-[10px] text-text-muted">Queue size: {gate.queueLength} travelers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-text-primary block">{gate.estimatedWaitTime} min</span>
                      <span className="text-[9px] text-text-muted">Est. wait time</span>
                    </div>
                    <Badge variant={gateColors[gate.status]}>{gate.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
