import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Search,
  Plus,
  Shield,
  Inbox,
  MapPin,
  User,
  Sparkles,
} from 'lucide-react';
import { IncidentSeverity, AccessibilityCategory, AccessibilityRequestStatus } from '../../domain/enums';
import { AccessibilityRequest } from '../../domain/models';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAccessibility, useAccessibilityAI } from '../../state';
import { pushToast } from '../../notifications/notificationService';

/**
 * Accessibility Operations Feature Page.
 * Integrates directly with useAccessibility() hook and useAccessibilityAI() decision support context.
 */
export default function AccessibilityPage(): React.JSX.Element {
  const {
    requests,
    selectedRequest,
    searchQuery,
    filterCategory,
    filterStatus,
    fetchRequests,
    selectRequest,
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
  } = useAccessibility();

  const { recommendations, analyzing, error: aiError, recommendAccessibilitySupport, clearRecommendations } = useAccessibilityAI();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    document.title = 'Accessibility Operations - StadiumOps AI';
    fetchRequests(searchQuery, filterCategory, filterStatus);
  }, [fetchRequests, searchQuery, filterCategory, filterStatus]);

  // Clear previous recommendations when selected request changes
  useEffect(() => {
    clearRecommendations();
  }, [selectedRequest, clearRecommendations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const priorityMap: Record<IncidentSeverity, 'danger' | 'warning' | 'info' | 'neutral'> = {
    [IncidentSeverity.CRITICAL]: 'danger',
    [IncidentSeverity.HIGH]: 'danger',
    [IncidentSeverity.MEDIUM]: 'warning',
    [IncidentSeverity.LOW]: 'neutral',
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stadium-border pb-6">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Accessibility Operations
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Coordinate accessibility services and visitor assistance across the stadium.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="font-semibold"
            onClick={() => {
              const id = `AST-${Math.floor(1000 + Math.random() * 9000)}`;
              pushToast(`New Assistance Logged: ${id}`, 'Staff dispatched to help visitor with sensory bags at sector lobby.', 'success');
            }}
          >
            <Plus className="w-5 h-5 mr-2" /> New Assistance Request
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS (BROADER 3-COLUMN LAYOUT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-bg-panel border border-white/[0.04] flex flex-col justify-between hover:border-stadium-accent/30 transition-all min-h-[100px]">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Requests</div>
          <div className="text-2xl font-black text-text-primary mt-1">18</div>
          <p className="text-[9px] text-text-muted mt-1">Shift logs combined</p>
        </Card>
        <Card className="p-5 bg-bg-panel border border-white/[0.04] flex flex-col justify-between hover:border-stadium-accent/30 transition-all min-h-[100px]">
          <div className="text-[10px] font-bold text-stadium-critical uppercase tracking-wider">Urgent Requests</div>
          <div className="text-2xl font-black text-stadium-critical mt-1 font-mono">4</div>
          <p className="text-[9px] text-stadium-critical font-semibold mt-1">Immediate dispatch SLA</p>
        </Card>
        <Card className="p-5 bg-bg-panel border border-white/[0.04] flex flex-col justify-between hover:border-stadium-accent/30 transition-all min-h-[100px]">
          <div className="text-[10px] font-bold text-stadium-accent uppercase tracking-wider">A11y Support Teams</div>
          <div className="text-2xl font-black text-stadium-accent mt-1 font-mono">15</div>
          <p className="text-[9px] text-text-muted mt-1">Ready for deployment</p>
        </Card>
      </div>

      {/* FILTER TOOLBAR */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-bg-panel border border-stadium-border rounded-md">
        <div className="flex items-center space-x-2 flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search request category, visitor name, or ID..."
            className="w-full bg-bg-secondary text-text-primary text-xs pl-10 pr-4 py-2 border border-stadium-border rounded focus:outline-none focus:ring-2 focus:ring-stadium-accent placeholder:text-text-muted"
            aria-label="Filter accessibility requests"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory || ''}
            onChange={(e) => setCategoryFilter(e.target.value ? (e.target.value as AccessibilityCategory) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Category: All</option>
            {Object.values(AccessibilityCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterStatus || ''}
            onChange={(e) => setStatusFilter(e.target.value ? (e.target.value as AccessibilityRequestStatus) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Status: All</option>
            {Object.values(AccessibilityRequestStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </form>

      {/* DUAL WORKSPACE SPLIT GRID */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE ASSISTANCE REQUESTS (65% width) */}
        <div className="w-full lg:w-[65%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Active Assistance Requests</h2>

          {requests.loading ? (
            <div className="space-y-3 animate-pulse" aria-busy="true">
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
            </div>
          ) : requests.data?.length === 0 ? (
            <div className="p-12 text-center bg-bg-panel border border-dashed border-stadium-border rounded flex flex-col items-center justify-center">
              <Inbox className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-base font-semibold text-text-primary">No Requests Found</h3>
              <p className="text-xs text-text-muted mt-2">Adjust search terms or filters.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {[...(requests.data || [])]
                .sort((a, b) => {
                  const priorityValue: Record<IncidentSeverity, number> = {
                    [IncidentSeverity.CRITICAL]: 4,
                    [IncidentSeverity.HIGH]: 3,
                    [IncidentSeverity.MEDIUM]: 2,
                    [IncidentSeverity.LOW]: 1,
                  };
                  const valA = priorityValue[a.priority] || 0;
                  const valB = priorityValue[b.priority] || 0;
                  if (valB !== valA) {
                    return valB - valA;
                  }
                  return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
                })
                .map((req: AccessibilityRequest) => {
                  const isSelected = req.id === selectedRequest?.id;
                  return (
                    <div
                      key={req.id}
                      onClick={() => selectRequest(req)}
                      className={`p-2.5 px-4 bg-[#14171d] border rounded transition-all hover:border-stadium-accent cursor-pointer flex items-center justify-between ${
                        isSelected ? 'border-stadium-accent ring-1 ring-stadium-accent bg-stadium-accent/5' : 'border-white/[0.04]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-xs text-text-primary font-bold">{req.category}</strong>
                          <span className="text-[9px] font-mono text-text-muted">({req.id})</span>
                        </div>
                        <p className="text-[10px] text-text-secondary mt-0.5">
                          Zone: <strong className="text-text-primary">{req.zoneId}</strong>
                          {req.notes && <span className="text-text-muted"> | {req.notes}</span>}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-[9.5px] text-text-muted font-mono">{new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <Badge variant={priorityMap[req.priority]}>{req.priority}</Badge>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0d0e12] text-text-secondary uppercase border border-white/[0.03]">
                          {req.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REQUEST DETAILS PANEL (35% width) */}
        <div className="w-full lg:w-[35%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Request Details HUD</h2>
          
          {selectedRequest ? (
            <Card className="bg-bg-panel text-xs text-text-secondary space-y-4 p-5 border border-stadium-border rounded-xl">
              <div className="flex items-center justify-between border-b border-stadium-border pb-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary leading-tight">
                    {selectedRequest.category}
                  </h3>
                  <span className="text-[10px] font-mono text-text-muted block mt-1">{selectedRequest.id}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-bg-secondary text-text-primary border border-stadium-border">
                  {selectedRequest.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Location Zone</span>
                    <span className="text-text-primary font-medium flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-stadium-gold-600" /> {selectedRequest.zoneId}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Visitor Name</span>
                    <span className="text-text-primary font-medium flex items-center">
                      <User className="w-3.5 h-3.5 mr-1" /> {selectedRequest.visitorName || 'Anonymous'}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Assigned Squad</span>
                    <span className="text-text-primary font-medium flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-1 text-stadium-accent" /> {selectedRequest.assignedTeam || 'None'}
                    </span>
                  </div>
                </div>

                {selectedRequest.notes && (
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-1">Operator Notes</span>
                    <p className="leading-relaxed bg-bg-secondary p-3 border border-stadium-border rounded text-text-secondary">
                      {selectedRequest.notes}
                    </p>
                  </div>
                )}

                <div className="border-t border-stadium-border pt-4">
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Required Gear</span>
                    <span className="text-text-primary font-medium">{selectedRequest.equipment || 'None'}</span>
                  </div>
                </div>

                {/* AI ACCESSIBILITY ADVISORY SUB-PANEL */}
                <div className="border-t border-stadium-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stadium-accent uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-stadium-accent animate-pulse" /> AI Assistive Advisory
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
                      <span>Gemini AI is generating routing optimizations...</span>
                    </div>
                  ) : aiError ? (
                    <div className="p-3 bg-stadium-critical/10 border border-stadium-critical/30 rounded text-stadium-critical text-xs">
                      <strong>Advisory Failed:</strong> {aiError}
                      <Button variant="outline" size="sm" onClick={() => recommendAccessibilitySupport(selectedRequest)} className="w-full mt-2 text-stadium-critical hover:bg-stadium-critical/10">
                        Retry Advisory
                      </Button>
                    </div>
                  ) : recommendations && recommendations.requestId === selectedRequest.id ? (
                    <div className="space-y-3 bg-bg-secondary p-3 border border-stadium-border rounded text-[11px] text-text-secondary leading-relaxed">
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Recommended Assistance</strong>
                        <span className="text-text-primary font-bold">{recommendations.recommendedAssistance}</span>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Priority Assessment</strong>
                        <Badge variant={recommendations.priorityAssessment === 'IMMEDIATE' || recommendations.priorityAssessment === 'HIGH' ? 'danger' : 'warning'}>
                          {recommendations.priorityAssessment}
                        </Badge>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Suggested Accessible Route</strong>
                        <p className="text-text-primary font-semibold mt-0.5">{recommendations.suggestedRoute}</p>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">AI Reasoning</strong>
                        <p className="text-text-primary mt-0.5">{recommendations.explanation}</p>
                      </div>
                      {recommendations.mitigationConsiderations.length > 0 && (
                        <div>
                          <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Mitigation Guidelines</strong>
                          <ul className="list-disc pl-4 mt-1 space-y-1 text-text-primary">
                            {recommendations.mitigationConsiderations.map((consideration, i) => (
                              <li key={i}>{consideration}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button variant="outline" size="sm" onClick={() => recommendAccessibilitySupport(selectedRequest)} className="w-full text-text-secondary border-dashed mt-2">
                        Refresh Advisory
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => recommendAccessibilitySupport(selectedRequest)} className="w-full font-semibold border-stadium-accent/40 text-stadium-accent hover:bg-stadium-accent/5">
                      Assess with Gemini AI
                    </Button>
                  )}
                </div>

                <div className="border-t border-stadium-border pt-4 space-y-2">
                  <span className="block font-semibold text-text-muted uppercase tracking-wider">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pushToast('Wheelchair Dispatched', `Sensory/wheelchair gear dispatched to sector lobby for ${selectedRequest.visitorName || 'visitor'}.`, 'success')}
                      className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5"
                    >
                      Request Wheelchair
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pushToast('Priority Escalated', `Priority level for ${selectedRequest.id} set to IMMEDIATE. Alert sent to zone commander.`, 'error')}
                      className="text-text-primary border-stadium-warning/50 hover:bg-stadium-warning/5"
                    >
                      Escalate Priority
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-bg-panel p-6 text-center text-text-muted border border-stadium-border rounded-xl">
              Select an assistance request from the list to load details.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
