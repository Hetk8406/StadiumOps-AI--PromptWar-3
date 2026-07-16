import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Users,
  Activity,
  Accessibility,
  HeartPulse,
  DoorOpen,
  ArrowRight,
  TrendingUp,
  MapPin,
  CloudSun,
  Truck,
  Shield,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ROUTES, IncidentSeverity } from '../../config/constants';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useDashboard, useDecisionSupportAI } from '../../state';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Operations Dashboard Home View.
 * Integrates directly with useDashboard() centralized telemetry state and useDecisionSupportAI() executive briefing.
 */
export default function DashboardPage(): React.JSX.Element {
  const { summary, activities, fetchSummary, fetchActivities } = useDashboard();
  const { briefing, loading: analyzing, error: aiError, generateBriefing } = useDecisionSupportAI();
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = 'Stadium Operations Command Center';
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
        <div className="h-16 bg-bg-panel border border-stadium-border rounded-md" />
        <div className="grid grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-24 bg-bg-panel border border-stadium-border rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 bg-bg-panel border border-stadium-border rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* 1. DASHBOARD HEADER AREA */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b border-stadium-border pb-6">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Stadium Operations Command Center
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Real-time operational overview for FIFA World Cup 2026
          </p>
        </div>

        {/* Dynamic Match Context HUD */}
        <div className="flex flex-wrap items-center gap-3 bg-bg-panel border border-stadium-border p-3 rounded-md shadow-subtle">
          <div className="flex items-center space-x-2 text-xs font-semibold text-text-secondary border-r border-stadium-border pr-3">
            <MapPin className="w-4 h-4 text-stadium-gold-600" />
            <span>MetLife Stadium</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-text-secondary border-r border-stadium-border pr-3">
            <span>{data.matchContext.matchName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stadium-critical opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stadium-critical"></span>
            </span>
            <span className="text-xs font-bold text-stadium-critical uppercase tracking-wider">LIVE</span>
            <span className="text-xs font-mono font-bold text-text-primary px-1.5 py-0.5 bg-bg-secondary rounded">
              {data.matchContext.countdownMinutes}'
            </span>
          </div>
        </div>

        {/* Quick Action Area */}
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" className="font-semibold" disabled>
            + Report Incident
          </Button>
          <Button variant="primary" size="sm" className="font-semibold" disabled>
            + Broadcast Message
          </Button>
          <Button variant="secondary" size="sm" className="font-semibold" disabled>
            + Dispatch Volunteer
          </Button>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Active Incidents */}
        <Card
          className="bg-bg-panel hover:border-text-muted transition-colors motion-fade-in"
          style={reduced ? {} : { animationDelay: '0ms' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Active Incidents</span>
            <AlertTriangle className="w-5 h-5 text-stadium-critical" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-text-primary">{data.incidents.active}</div>
            <div className="flex items-center space-x-1 mt-1 text-[11px]">
              <TrendingUp className="w-3 h-3 text-stadium-critical" />
              <span className="text-stadium-critical font-medium">Critical: {data.incidents.critical}</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Available Volunteers */}
        <Card className="bg-bg-panel hover:border-text-muted transition-colors motion-fade-in" style={reduced ? {} : { animationDelay: '30ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Volunteers</span>
            <Users className="w-5 h-5 text-stadium-accent" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-text-primary">{data.volunteers.total}</div>
            <div className="text-[11px] text-text-muted mt-1">
              <strong className="text-text-secondary">{data.volunteers.onDuty}</strong> on shift today
            </div>
          </div>
        </Card>

        {/* Card 3: Crowd Density */}
        <Card className="bg-bg-panel hover:border-text-muted transition-colors motion-fade-in" style={reduced ? {} : { animationDelay: '60ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Crowd Density</span>
            <Activity className="w-5 h-5 text-stadium-warning" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-text-primary">{data.attendance.occupancyRate}%</div>
            <div className="text-[11px] text-stadium-warning font-semibold mt-1">
              STATUS: MODERATE
            </div>
          </div>
        </Card>

        {/* Card 4: Open Gates */}
        <Card className="bg-bg-panel hover:border-text-muted transition-colors motion-fade-in" style={reduced ? {} : { animationDelay: '90ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Open Gates</span>
            <DoorOpen className="w-5 h-5 text-stadium-success" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-text-primary">21 / 24</div>
            <div className="text-[11px] text-text-muted mt-1">
              <strong className="text-stadium-warning">3 gates</strong> restricted flow
            </div>
          </div>
        </Card>

        {/* Card 5: Accessibility Requests */}
        <Card className="bg-bg-panel hover:border-text-muted transition-colors motion-fade-in" style={reduced ? {} : { animationDelay: '120ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">A11y Requests</span>
            <Accessibility className="w-5 h-5 text-stadium-info" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-text-primary">{data.accessibility.activeRequests}</div>
            <div className="text-[11px] text-stadium-critical font-semibold mt-1">
              {data.accessibility.pendingWheelchairs} URGENT PENDING
            </div>
          </div>
        </Card>

        {/* Card 6: System Health */}
        <Card className="bg-bg-panel hover:border-text-muted transition-colors motion-fade-in" style={reduced ? {} : { animationDelay: '150ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">System Health</span>
            <HeartPulse className="w-5 h-5 text-stadium-success" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-text-primary">98%</div>
            <div className="text-[11px] text-stadium-success font-semibold mt-1">
              ALL NODES ONLINE
            </div>
          </div>
        </Card>
      </div>

      {/* Central AI Decision Briefing Panel */}
      <Card className="bg-bg-panel border-dashed border-stadium-accent bg-stadium-accent/5 p-5 space-y-4 text-xs text-text-secondary motion-fade-in" style={reduced ? {} : { animationDelay: '180ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stadium-border pb-3 gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-stadium-accent animate-pulse" />
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Executive Decision Briefing</h2>
          </div>
          <div className="flex items-center gap-2">
            {briefing && (
              <span className="text-[11px] text-text-muted mr-2">
                Unified Status Assessment: <strong className={`font-bold ${
                  briefing.overallStatus === 'RED' ? 'text-stadium-critical' :
                  briefing.overallStatus === 'ORANGE' ? 'text-stadium-warning' : 'text-stadium-success'
                }`}>{briefing.overallStatus}</strong>
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-stadium-accent text-stadium-accent font-bold hover:bg-stadium-accent/15"
              onClick={handleGenerateBriefing}
              disabled={analyzing}
            >
              {analyzing ? 'Gemini AI synthesizing command center logs...' : briefing ? 'Re-Analyze command logs' : 'Synthesize Command Center Logs'}
            </Button>
          </div>
        </div>

        {analyzing ? (
          <div className="p-8 text-center text-text-muted flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-stadium-accent animate-spin" />
            <span className="font-semibold text-text-primary">Synthesizing telemetry logs across all 5 operational units...</span>
            <p className="text-[11px] text-text-muted max-w-md">Gemini AI is scanning incidents, standby staff capacity, transit rates, accessibility priority tickets, and public display boards status.</p>
          </div>
        ) : aiError ? (
          <div className="p-4 bg-stadium-critical/10 border border-stadium-critical/30 rounded text-stadium-critical flex items-center justify-between">
            <span><strong>Briefing Formulation Failed:</strong> {aiError}</span>
            <Button variant="outline" size="sm" onClick={handleGenerateBriefing} className="text-stadium-critical hover:bg-stadium-critical/10">Retry</Button>
          </div>
        ) : briefing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 leading-relaxed">
            
            {/* COLUMN 1: EXECUTIVE BRIEF */}
            <div className="lg:col-span-2 space-y-3 bg-bg-secondary/40 p-4 rounded border border-stadium-border/40">
              <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-1 font-bold">Executive Intelligence Briefing</strong>
              <p className="text-text-primary text-xs leading-relaxed">{briefing.executiveSummary}</p>
            </div>

            {/* COLUMN 2: COORDINATED ADVISORIES */}
            <div className="space-y-3 bg-bg-secondary/40 p-4 rounded border border-stadium-border/40">
              <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-1 font-bold">Coordinated Recommendations</strong>
              <div className="space-y-2">
                {briefing.coordinatedRecommendations.map((rec, i) => (
                  <div key={i} className="bg-bg-panel p-2.5 rounded border border-stadium-border/40 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary text-[10px]">{rec.title}</span>
                      <Badge variant={rec.priority === 'IMMEDIATE' || rec.priority === 'HIGH' ? 'danger' : 'warning'}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-text-muted font-semibold">{rec.action}</p>
                    <p className="text-[10px] text-text-secondary leading-normal">{rec.rationalExplanation}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-stadium-border/60 rounded bg-bg-secondary/30 text-text-muted">
            Ready to perform cross-module analysis. Click "Synthesize Command Center Logs" above to trigger Gemini Decision Support.
          </div>
        )}
      </Card>

      {/* 3. CORE OVERVIEW OPERATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* PANEL A: RECENT INCIDENTS */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Incidents</CardTitle>
            <Link to={ROUTES.INCIDENTS} className="text-xs font-bold text-stadium-accent hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </CardHeader>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {/* Incident 1 */}
            <div className="p-3 bg-bg-secondary border border-stadium-border rounded-md hover:border-stadium-critical/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Medical Emergency</span>
                <Badge variant="danger">{IncidentSeverity.CRITICAL}</Badge>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                <span>Gate C</span>
                <span>2 min ago</span>
              </div>
            </div>

            {/* Incident 2 */}
            <div className="p-3 bg-bg-secondary border border-stadium-border rounded-md hover:border-stadium-critical/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Crowd Congestion</span>
                <Badge variant="danger">{IncidentSeverity.HIGH}</Badge>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                <span>North Entrance</span>
                <span>5 min ago</span>
              </div>
            </div>

            {/* Incident 3 */}
            <div className="p-3 bg-bg-secondary border border-stadium-border rounded-md hover:border-stadium-warning/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Lost Child</span>
                <Badge variant="warning">{IncidentSeverity.MEDIUM}</Badge>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                <span>Zone B</span>
                <span>12 min ago</span>
              </div>
            </div>

            {/* Incident 4 */}
            <div className="p-3 bg-bg-secondary border border-stadium-border rounded-md hover:border-stadium-info/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Equipment Failure</span>
                <Badge variant="neutral">{IncidentSeverity.LOW}</Badge>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                <span>VIP Lounge</span>
                <span>18 min ago</span>
              </div>
            </div>
          </div>
        </Card>

        {/* PANEL B: VOLUNTEER ACTIVITY */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Volunteer Coordination</CardTitle>
            <Link to={ROUTES.VOLUNTEERS} className="text-xs font-bold text-stadium-accent hover:underline flex items-center">
              Deploy <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </CardHeader>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-bg-secondary rounded-md border border-stadium-border">
                <div className="text-xs text-text-muted font-medium">Currently Active</div>
                <div className="text-2xl font-bold text-text-primary mt-1">{data.volunteers.onDuty}</div>
              </div>
              <div className="p-3 bg-bg-secondary rounded-md border border-stadium-border">
                <div className="text-xs text-text-muted font-medium">Available</div>
                <div className="text-2xl font-bold text-stadium-accent mt-1">{data.volunteers.available}</div>
              </div>
              <div className="p-3 bg-bg-secondary rounded-md border border-stadium-border">
                <div className="text-xs text-text-muted font-medium">On Break</div>
                <div className="text-2xl font-bold text-text-secondary mt-1">{data.volunteers.break}</div>
              </div>
              <div className="p-3 bg-bg-secondary rounded-md border border-stadium-border">
                <div className="text-xs text-text-muted font-medium">Medical Teams</div>
                <div className="text-2xl font-bold text-stadium-success mt-1">8</div>
              </div>
            </div>

            <div className="border-t border-stadium-border pt-4">
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Language Coverage</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">English-Spanish Teams</span>
                  <span className="text-text-primary font-bold">14 Teams</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">English-French Teams</span>
                  <span className="text-text-primary font-bold">6 Teams</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* PANEL C: CROWD STATUS PROGRESS METERS */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crowd Status & Gates</CardTitle>
            <Link to={ROUTES.CROWD} className="text-xs font-bold text-stadium-accent hover:underline flex items-center">
              Gate Details <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </CardHeader>
          <div className="flex-1 space-y-4">
            {/* North Gate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text-secondary">North Gate Entrance</span>
                <span className="font-bold text-stadium-warning">72% Capacity</span>
              </div>
              <div className="w-full bg-bg-secondary rounded-full h-2">
                <div className="bg-stadium-warning h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            {/* South Gate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text-secondary">South Gate Entrance</span>
                <span className="font-bold text-stadium-critical">{data.attendance.occupancyRate}% Capacity</span>
              </div>
              <div className="w-full bg-bg-secondary rounded-full h-2">
                <div className="bg-stadium-critical h-2 rounded-full" style={{ width: `${data.attendance.occupancyRate}%` }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* PANEL D: UPCOMING MATCHES & ACTIVITIES */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Live Activity Feed</CardTitle>
          </CardHeader>
          <div className="flex-1 space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {activities.data?.map((act, i) => (
              <div key={i} className="p-2.5 bg-bg-secondary border border-stadium-border rounded text-[11px] leading-relaxed text-text-secondary">
                {act}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. OPERATIONAL ALERTS BAR */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">Critical Operational Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="p-3 border-l-4 border-stadium-warning bg-bg-panel rounded-r shadow-subtle flex items-start space-x-3">
            <CloudSun className="w-5 h-5 text-stadium-warning flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-text-primary">Weather Advisory</div>
              <div className="text-[11px] text-text-secondary mt-1">
                Temp: {data.weather.tempCelsius}°C - {data.weather.condition}. Wind: {data.weather.windSpeed}.
              </div>
            </div>
          </div>
          <div className="p-3 border-l-4 border-stadium-critical bg-bg-panel rounded-r shadow-subtle flex items-start space-x-3">
            <Truck className="w-5 h-5 text-stadium-critical flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-text-primary">Transport Delay</div>
              <div className="text-[11px] text-text-secondary mt-1">Train line 4 suspended. Bus shuttles rerouted.</div>
            </div>
          </div>
          <div className="p-3 border-l-4 border-stadium-accent bg-bg-panel rounded-r shadow-subtle flex items-start space-x-3">
            <Shield className="w-5 h-5 text-stadium-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-text-primary">Security Notice</div>
              <div className="text-[11px] text-text-secondary mt-1">Active alerts today: {data.broadcasts.activeAlerts}.</div>
            </div>
          </div>
          <div className="p-3 border-l-4 border-stadium-info bg-bg-panel rounded-r shadow-subtle flex items-start space-x-3">
            <Accessibility className="w-5 h-5 text-stadium-info flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-text-primary">Accessibility Notice</div>
              <div className="text-[11px] text-text-secondary mt-1">Active requests queue: {data.accessibility.activeRequests}.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DUAL FOOTER MODULES: AI ROOMS & SYSTEM NODES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* PANEL E: AI RECOMMENDATION MODULE */}
        <Card className="xl:col-span-2 border-dashed border-stadium-accent bg-stadium-accent/5 flex items-center justify-between p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-stadium-accent/20 border border-stadium-accent/40 rounded-md">
              <Sparkles className="w-6 h-6 text-stadium-accent" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                AI Operational Recommendations Room
              </h3>
              <p className="text-xs text-text-secondary mt-1 max-w-xl">
                AI-powered decision-support recommendations will appear here after Gemini engine integration in Phase 4. This includes automated incident triage classifications, crowd route load-balancing advice, and multilingually aligned staff dispatch routes.
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-xs font-bold text-stadium-accent uppercase border border-stadium-accent/30 px-3 py-1.5 rounded bg-bg-primary">
            Gemini Offline
          </div>
        </Card>

        {/* PANEL F: TELEMETRY SYSTEM HEALTH CHECK */}
        <Card>
          <CardHeader>
            <CardTitle>System Nodes Check</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-stadium-success" />
              <span className="text-text-secondary">API: {data.systemStatus.sensorGrid}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 text-stadium-warning" />
              <span className="text-text-secondary">AI ENG: {data.systemStatus.translationEngine}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-stadium-success" />
              <span className="text-text-secondary">DB: {data.systemStatus.dispatchQueue}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 6. QUICK NAVIGATION PORTALS */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">Quick Navigation Portals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Link
            to={ROUTES.INCIDENTS}
            className="p-4 bg-bg-panel border border-stadium-border rounded-md hover:border-stadium-accent hover:-translate-y-0.5 transition-all motion-focus-ring focus:outline-none focus:ring-2 focus:ring-stadium-accent flex items-center justify-between motion-fade-in"
            style={reduced ? {} : { animationDelay: '200ms' }}
          >
            <div>
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Incidents Log</div>
              <p className="text-[10px] text-text-muted mt-1">Review active security & medical alerts</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </Link>

          <Link
            to={ROUTES.VOLUNTEERS}
            className="p-4 bg-bg-panel border border-stadium-border rounded-md hover:border-stadium-accent hover:-translate-y-0.5 transition-all motion-focus-ring focus:outline-none focus:ring-2 focus:ring-stadium-accent flex items-center justify-between motion-fade-in"
            style={reduced ? {} : { animationDelay: '230ms' }}
          >
            <div>
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Volunteers Control</div>
              <p className="text-[10px] text-text-muted mt-1">Track staff allocation & language skill matches</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </Link>

          <Link
            to={ROUTES.CROWD}
            className="p-4 bg-bg-panel border border-stadium-border rounded-md hover:border-stadium-accent hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-stadium-accent flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Crowd Intelligence</div>
              <p className="text-[10px] text-text-muted mt-1">Observe turnstile capacity & load flow levels</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </Link>

          <Link
            to={ROUTES.COMMUNICATIONS}
            className="p-4 bg-bg-panel border border-stadium-border rounded-md hover:border-stadium-accent hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-stadium-accent flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Communications Hub</div>
              <p className="text-[10px] text-text-muted mt-1">Broadcast auto-translated announcements</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </Link>

          <Link
            to={ROUTES.ACCESSIBILITY}
            className="p-4 bg-bg-panel border border-stadium-border rounded-md hover:border-stadium-accent hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-stadium-accent flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Accessibility</div>
              <p className="text-[10px] text-text-muted mt-1">Dispatch senior & mobility support staff</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
