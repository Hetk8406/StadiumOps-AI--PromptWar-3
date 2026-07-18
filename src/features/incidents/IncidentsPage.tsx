import React, { useEffect, useState } from 'react';
import {
  User,
  Plus,
  RefreshCw,
  Search,
  Inbox,
  Sparkles,
  X,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useIncidents, useIncidentAI } from '../../state';
import { IncidentSeverity, IncidentStatus } from '../../domain/enums';
import { Incident } from '../../domain/models';
import { pushToast } from '../../notifications/notificationService';
import { incidents } from '../../mocks/incidents/incidents';

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

  // Manual Log Incident modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>(IncidentSeverity.LOW);
  const [newZone, setNewZone] = useState('North Stand');
  const [newDescription, setNewDescription] = useState('');

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

  const handleLogNewIncident = () => {
    setIsModalOpen(true);
  };

  const updateIncidentStatus = (id: string, nextStatus: IncidentStatus) => {
    const target = incidents.find(inc => inc.id === id);
    if (target) {
      target.status = nextStatus;
      target.updatedAt = new Date().toISOString();
      if (nextStatus === IncidentStatus.RESOLVED) {
        target.resolvedAt = new Date().toISOString();
      }
    }
    fetchIncidents(searchQuery, filterStatus, filterSeverity);
    if (selected && selected.id === id) {
      selectIncident({ ...selected, status: nextStatus });
    }
  };

  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    // Numerical ordered ID generation
    let maxNum = 129; // default baseline in mocks
    incidents.forEach(inc => {
      const match = inc.id.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    const id = `INC-2026-${maxNum + 1}`;
    
    const newIncident: Incident = {
      id,
      title: newTitle,
      description: newDescription,
      severity: newSeverity,
      status: IncidentStatus.OPEN,
      zoneId: newZone,
      reportedBy: 'Profile User',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedResponseTime: newSeverity === IncidentSeverity.CRITICAL ? '2 min' : '8 min',
      notes: ['Incident manually logged by profile operator.'],
      attachments: [],
    };

    incidents.unshift(newIncident);
    fetchIncidents(searchQuery, filterStatus, filterSeverity);
    selectIncident(newIncident);

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewSeverity(IncidentSeverity.LOW);
    setNewZone('North Stand');
    setIsModalOpen(false);

    pushToast(
      `New Incident Logged: ${id}`,
      'Security first responders notified. Incident details dispatched to on-duty marshals.',
      'success'
    );
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
          <Button variant="danger" size="sm" className="font-semibold" onClick={handleLogNewIncident}>
            <Plus className="w-5 h-5 mr-2" /> Log New Incident
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
            placeholder="Search incident reports..."
            className="w-full bg-bg-secondary text-text-primary text-xs pl-10 pr-4 py-2 border border-stadium-border rounded focus:outline-none focus:ring-2 focus:ring-stadium-accent placeholder:text-text-muted"
            aria-label="Filter incidents list"
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
            {Object.values(IncidentSeverity).map((severity) => (
              <option key={severity} value={severity}>{severity}</option>
            ))}
          </select>
        </div>
      </form>

      {/* SPLIT MAIN SECTION */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: LIST (65% width) */}
        <div className="w-full lg:w-[65%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Active Incident Queue</h2>

          {list.loading ? (
            <div className="space-y-3 animate-pulse" aria-busy="true">
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
            </div>
          ) : list.data?.length === 0 ? (
            <div className="p-12 text-center bg-bg-panel border border-dashed border-stadium-border rounded-md flex flex-col items-center justify-center">
              <Inbox className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-base font-semibold text-text-primary">No Incidents Logged</h3>
              <p className="text-xs text-text-muted mt-2">Create new incident records or adjust search parameters.</p>
            </div>
          ) : (
            <div className="bg-[#14171d] border border-white/[0.04] rounded-xl overflow-hidden shadow-subtle">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stadium-border bg-[#0a0b0d]/60 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 z-10">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Incident Title</th>
                      <th className="py-2.5 px-3">Zone</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-white/[0.02]">
                    {list.data
                      ?.slice()
                      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
                      .map((inc: Incident) => {
                      const isSelected = selected?.id === inc.id;
                      return (
                        <tr
                          key={inc.id}
                          onClick={() => selectIncident(inc)}
                          className={`cursor-pointer hover:bg-white/[0.02] transition-colors ${
                            isSelected ? 'bg-stadium-accent/10 border-l-2 border-stadium-accent' : ''
                          }`}
                        >
                          <td className="py-2 px-3 font-mono font-bold text-text-muted">{inc.id}</td>
                          <td className="py-2 px-3">
                            <Badge variant={severityMap[inc.severity]}>{inc.severity}</Badge>
                          </td>
                          <td className="py-2 px-3 font-bold text-text-primary">{inc.title}</td>
                          <td className="py-2 px-3 text-text-secondary">{inc.zoneId}</td>
                          <td className="py-2 px-3 text-text-muted">
                            {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-bg-secondary text-text-secondary uppercase">
                              {inc.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS (35% width) */}
        <div className="w-full lg:w-[35%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Incident Details HUD</h2>

          {selected ? (
            <Card className="bg-bg-panel text-xs text-text-secondary space-y-4 p-5 border border-stadium-border">
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
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-1">Status</span>
                    <select
                      value={selected.status}
                      onChange={(e) => updateIncidentStatus(selected.id, e.target.value as IncidentStatus)}
                      className="bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer font-bold uppercase tracking-wider"
                    >
                      {Object.values(IncidentStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
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
                  <span className="block font-semibold text-text-muted uppercase tracking-wider">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateIncidentStatus(selected.id, IncidentStatus.ASSIGNED);
                        pushToast('Squad Dispatched', `Coordinated response team dispatched to ${selected.zoneId} for ${selected.id}.`, 'success');
                      }}
                      className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5"
                    >
                      Dispatch Squad
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateIncidentStatus(selected.id, IncidentStatus.RESOLVED);
                        pushToast('Incident Resolved', `Incident ${selected.id} has been marked as RESOLVED in the command center database.`, 'info');
                      }}
                      className="text-text-primary border-stadium-success/50 hover:bg-stadium-success/5"
                    >
                      Resolve Incident
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-bg-panel p-6 text-center text-text-muted border border-stadium-border">
              Select an incident from the queue to view detailed diagnostics logs.
            </Card>
          )}
        </div>

      </div>

      {/* 2. MANUAL LOG INCIDENT OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#14171d] border border-white/[0.08] rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stadium-border pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log New Incident</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitIncident} className="space-y-4 text-xs text-text-secondary">
              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Incident Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Crowded Turnstiles, Power Outage, Fan Injury"
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                >
                  {Object.values(IncidentSeverity).map((sev) => (
                    <option key={sev} value={sev}>{sev}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Zone</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                >
                  {['North Stand', 'South Stand', 'East Stand', 'West Stand', 'VIP Area', 'Parking Zone A', 'Fan Zone B'].map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Incident Description / Details</label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide precise details of the incident, people involved, or location references."
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="font-bold uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-stadium-accent hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
                >
                  Log Incident
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
