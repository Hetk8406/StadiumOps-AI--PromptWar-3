import React, { useEffect, useState } from 'react';
import {
  User,
  Plus,
  RefreshCw,
  Search,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useIncidents, useIncidentAI } from '../../state';
import { IncidentSeverity, IncidentStatus } from '../../domain/enums';
import { Incident } from '../../domain/models';

/**
 * Incident Monitoring Feature Page.
 * Integrates directly with useIncidents() centralized telemetry state and useIncidentAI() support hooks.
 */
export default function IncidentsPage(): React.JSX.Element {
  const {
    list,
    selected,
    searchQuery,
    filterStatus,
    filterSeverity,
    fetchIncidents,
    selectIncident,
    setSearchQuery,
    setStatusFilter,
    setSeverityFilter,
  } = useIncidents();

  const { analysis, analyzing, error: aiError, analyzeIncident, clearAnalysis } = useIncidentAI();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    document.title = 'Incident Monitoring - StadiumOps AI';
    fetchIncidents(searchQuery, filterStatus, filterSeverity);
  }, [fetchIncidents, searchQuery, filterStatus, filterSeverity]);

  // Clear previous analysis when selected incident changes
  useEffect(() => {
    clearAnalysis();
  }, [selected, clearAnalysis]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handleRefresh = () => {
    fetchIncidents(searchQuery, filterStatus, filterSeverity);
  };

  const severityMap: Record<IncidentSeverity, 'danger' | 'warning' | 'info' | 'neutral'> = {
    [IncidentSeverity.CRITICAL]: 'danger',
    [IncidentSeverity.HIGH]: 'danger',
    [IncidentSeverity.MEDIUM]: 'warning',
    [IncidentSeverity.LOW]: 'neutral',
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stadium-border pb-6">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Incident Monitoring
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Real-time security, medical, and crowd incident coordination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" className="font-semibold" disabled>
            <Plus className="w-4 h-4 mr-1.5" /> Log New Incident
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="text-text-secondary">
            <RefreshCw className={`w-4 h-4 ${list.loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-bg-panel border border-stadium-border rounded-md">
        <div className="flex items-center space-x-2 flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search incident title, description, ID..."
            className="w-full bg-bg-secondary text-text-primary text-xs pl-10 pr-4 py-2 border border-stadium-border rounded focus:outline-none focus:ring-2 focus:ring-stadium-accent placeholder:text-text-muted"
            aria-label="Filter incidents log"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus || ''}
            onChange={(e) => setStatusFilter(e.target.value ? (e.target.value as IncidentStatus) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Status: All</option>
            {Object.values(IncidentStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filterSeverity || ''}
            onChange={(e) => setSeverityFilter(e.target.value ? (e.target.value as IncidentSeverity) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Severity: All</option>
            {Object.values(IncidentSeverity).map((sev) => (
              <option key={sev} value={sev}>{sev}</option>
            ))}
          </select>
        </div>
      </form>

      {/* SPLIT MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Active Incident Queue</h2>

          {list.loading ? (
            <div className="space-y-3 animate-pulse" aria-busy="true">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 bg-bg-panel border border-stadium-border rounded-md" />
              ))}
            </div>
          ) : list.data?.length === 0 ? (
            <div className="p-12 text-center bg-bg-panel border border-dashed border-stadium-border rounded-md flex flex-col items-center justify-center">
              <Inbox className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-base font-semibold text-text-primary">No Incidents Logged</h3>
              <p className="text-xs text-text-muted mt-2">Create new incident records or adjust search parameters.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {list.data?.map((inc: Incident) => {
                const isSelected = selected?.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => selectIncident(inc)}
                    className={`p-4 bg-bg-panel border rounded-md cursor-pointer transition-all hover:border-stadium-accent ${
                      isSelected ? 'border-stadium-accent ring-1 ring-stadium-accent' : 'border-stadium-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-text-muted">{inc.id}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={severityMap[inc.severity]}>{inc.severity}</Badge>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-bg-secondary text-text-secondary uppercase">
                          {inc.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-text-primary mt-2">{inc.title}</h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">{inc.description}</p>

                    <div className="flex items-center justify-between mt-3 text-xs text-text-muted border-t border-stadium-border/40 pt-2.5">
                      <span>Zone: <strong className="text-text-secondary">{inc.zoneId}</strong></span>
                      <span>{new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Incident Details HUD</h2>

          {selected ? (
            <Card className="bg-bg-panel text-xs text-text-secondary space-y-4">
              <div className="flex items-center justify-between border-b border-stadium-border pb-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary leading-tight">{selected.title}</h3>
                  <span className="text-[10px] font-mono text-text-muted block mt-1">{selected.id}</span>
                </div>
                <Badge variant={severityMap[selected.severity]}>{selected.severity}</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block font-semibold text-text-muted uppercase tracking-wider mb-1">Description</span>
                  <p className="leading-relaxed bg-bg-secondary p-3 border border-stadium-border rounded text-text-secondary">
                    {selected.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Status</span>
                    <span className="text-text-primary font-medium">{selected.status}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Reporting Zone</span>
                    <span className="text-text-primary font-medium">{selected.zoneId}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Assigned Dispatch</span>
                    <span className="text-text-primary font-medium">{selected.assignedTeam || 'None'}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Reported By</span>
                    <span className="text-text-primary font-medium flex items-center">
                      <User className="w-3.5 h-3.5 mr-1" /> {selected.reportedBy}
                    </span>
                  </div>
                </div>

                {/* AI DECISION SUPPORT SUB-PANEL */}
                <div className="border-t border-stadium-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stadium-accent uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-stadium-accent" /> AI Decision Support
                    </span>
                    {analysis && (
                      <span className="text-[10px] text-text-muted">
                        Confidence: <strong className="text-stadium-success">{analysis.confidenceCategory} ({Math.round(analysis.confidence * 100)}%)</strong>
                      </span>
                    )}
                  </div>

                  {analyzing ? (
                    <div className="p-4 bg-bg-secondary border border-stadium-border rounded text-center text-text-muted flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-stadium-accent animate-spin" />
                      <span>Gemini AI is processing incident parameters...</span>
                    </div>
                  ) : aiError ? (
                    <div className="p-3 bg-stadium-critical/10 border border-stadium-critical/30 rounded text-stadium-critical text-xs">
                      <strong>AI Analysis Failed:</strong> {aiError}
                      <Button variant="outline" size="sm" onClick={() => analyzeIncident(selected)} className="w-full mt-2 text-stadium-critical hover:bg-stadium-critical/10">
                        Retry Analysis
                      </Button>
                    </div>
                  ) : analysis && analysis.incidentId === selected.id ? (
                    <div className="space-y-3 bg-bg-secondary p-3 border border-stadium-border rounded text-[11px] text-text-secondary leading-relaxed">
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">AI Classification</strong>
                        <span>{analysis.classification}</span>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Urgency Level Assessment</strong>
                        <Badge variant={analysis.urgencyLevel === 'CRITICAL' || analysis.urgencyLevel === 'HIGH' ? 'danger' : 'warning'}>
                          {analysis.urgencyLevel}
                        </Badge>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">AI Reasoning</strong>
                        <p className="mt-0.5 text-text-primary">{analysis.reasoning}</p>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Suggested Dispatches</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.suggestedDispatches.map((disp, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-stadium-accent/10 border border-stadium-accent/30 text-stadium-accent text-[9px] font-bold">
                              {disp}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Suggested Action Guidelines</strong>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-text-primary">
                          {analysis.mitigationSuggestions.map((mit, i) => (
                            <li key={i}>{mit}</li>
                          ))}
                        </ul>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => analyzeIncident(selected)} className="w-full text-text-secondary border-dashed mt-2">
                        Refresh Advisory
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => analyzeIncident(selected)} className="w-full font-semibold border-stadium-accent/40 text-stadium-accent hover:bg-stadium-accent/5">
                      Analyze with Gemini AI
                    </Button>
                  )}
                </div>

                <div className="border-t border-stadium-border pt-4 space-y-2">
                  <span className="block font-semibold text-text-muted uppercase tracking-wider">Quick Actions (Disabled)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled className="text-text-muted border-dashed">
                      Dispatch Squad
                    </Button>
                    <Button variant="outline" size="sm" disabled className="text-text-muted border-dashed">
                      Resolve Incident
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-bg-panel p-6 text-center text-text-muted">
              Select an incident from the queue to view detailed diagnostics logs.
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
