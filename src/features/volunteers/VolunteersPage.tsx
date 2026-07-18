import React, { useEffect, useState } from 'react';
import {
  Plus,
  RefreshCw,
  Search,
  Inbox,
  Star,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useVolunteers, useVolunteerAI } from '../../state';
import { VolunteerRole, VolunteerStatus } from '../../domain/enums';
import { Volunteer } from '../../domain/models';
import { pushToast } from '../../notifications/notificationService';

/**
 * Volunteer Roster Deployment Module View.
 * Integrates directly with useVolunteers() centralized state management and useVolunteerAI() decision advisory tools.
 */
export default function VolunteersPage(): React.JSX.Element {
  const {
    list,
    selected,
    searchQuery,
    filterRole,
    filterStatus,
    fetchVolunteers,
    selectVolunteer,
    setSearchQuery,
    setRoleFilter,
    setStatusFilter,
  } = useVolunteers();

  const { recommendations, analyzing, error: aiError, recommendAssignments, clearRecommendations } = useVolunteerAI();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    document.title = 'Volunteer Operations - StadiumOps AI';
    fetchVolunteers(searchQuery, filterRole, filterStatus);
  }, [fetchVolunteers, searchQuery, filterRole, filterStatus]);

  // Clear previous recommendations when selected volunteer changes
  useEffect(() => {
    clearRecommendations();
  }, [selected, clearRecommendations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handleRegisterVolunteer = () => {
    const id = `VOL-${Math.floor(1000 + Math.random() * 9000)}`;
    pushToast(`New Volunteer Registered: ${id}`, 'Successfully added to active tournament roster database.', 'success');
  };

  const statusColors: Record<VolunteerStatus, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
    [VolunteerStatus.AVAILABLE]: 'success',
    [VolunteerStatus.ASSIGNED]: 'info',
    [VolunteerStatus.BUSY]: 'warning',
    [VolunteerStatus.BREAK]: 'neutral',
    [VolunteerStatus.OFFLINE]: 'danger',
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stadium-border pb-6">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Volunteer Operations
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Monitor, coordinate, and dispatch tournament volunteers and stewards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" className="font-semibold" onClick={handleRegisterVolunteer}>
            <Plus className="w-5 h-5 mr-2" /> Register Volunteer
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
            placeholder="Search volunteer first name, last name, or ID..."
            className="w-full bg-bg-secondary text-text-primary text-xs pl-10 pr-4 py-2 border border-stadium-border rounded focus:outline-none focus:ring-2 focus:ring-stadium-accent placeholder:text-text-muted"
            aria-label="Filter volunteers list"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterRole || ''}
            onChange={(e) => setRoleFilter(e.target.value ? (e.target.value as VolunteerRole) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Role: All</option>
            {Object.values(VolunteerRole).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={filterStatus || ''}
            onChange={(e) => setStatusFilter(e.target.value ? (e.target.value as VolunteerStatus) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Status: All</option>
            {Object.values(VolunteerStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </form>

      {/* MAIN LAYOUT SPLIT */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: LIST (65% width) */}
        <div className="w-full lg:w-[65%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">On-Duty Volunteers</h2>

          {list.loading ? (
            <div className="space-y-3 animate-pulse" aria-busy="true">
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
              <div className="h-10 bg-bg-panel border border-stadium-border rounded" />
            </div>
          ) : list.data?.length === 0 ? (
            <div className="p-12 text-center bg-bg-panel border border-dashed border-stadium-border rounded flex flex-col items-center justify-center">
              <Inbox className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-base font-semibold text-text-primary">No Volunteers Registered</h3>
              <p className="text-xs text-text-muted mt-2">Adjust filters or search parameters.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {list.data?.map((v: Volunteer) => {
                const isSelected = selected?.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => selectVolunteer(v)}
                    className={`p-2.5 px-4 bg-[#14171d] border rounded transition-all hover:border-stadium-accent cursor-pointer flex items-center justify-between ${
                      isSelected ? 'border-stadium-accent ring-1 ring-stadium-accent bg-stadium-accent/5' : 'border-white/[0.04]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-xs text-text-primary font-bold">{v.firstName} {v.lastName}</strong>
                        <span className="text-[9px] font-mono text-text-muted">({v.id})</span>
                        <span className="text-[10px] text-text-muted">| {v.role}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-0.5">Zone: <strong className="text-text-primary">{v.currentZone}</strong></p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-[9.5px] text-text-muted font-semibold">Exp: {v.experienceLevel}</span>
                      <Badge variant={statusColors[v.status]}>{v.status}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS (35% width) */}
        <div className="w-full lg:w-[35%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Volunteer Diagnostics HUD</h2>

          {selected ? (
            <Card className="bg-bg-panel text-xs text-text-secondary space-y-4 p-5 border border-stadium-border">
              <div className="flex items-center justify-between border-b border-stadium-border pb-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary leading-tight">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <span className="text-[10px] font-mono text-text-muted block mt-1">{selected.id}</span>
                </div>
                <Badge variant={statusColors[selected.status]}>{selected.status}</Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Role</span>
                    <span className="text-text-primary font-medium">{selected.role}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Languages</span>
                    <span className="text-text-primary font-medium">{selected.languages.join(', ')}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Experience</span>
                    <span className="text-text-primary font-medium">{selected.experienceLevel}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Current Zone</span>
                    <span className="text-text-primary font-medium">{selected.currentZone}</span>
                  </div>
                </div>

                <div className="border-t border-stadium-border pt-4">
                  <span className="block font-semibold text-text-muted uppercase tracking-wider mb-1">Certifications</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selected.certifications.map((cert) => (
                      <span key={cert} className="px-2 py-0.5 rounded text-[10px] bg-bg-secondary text-text-secondary border border-stadium-border">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stadium-border pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Availability</span>
                    <span className="text-text-primary font-medium">{selected.availability ? 'Available' : 'Unavailable'}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Rating</span>
                    <span className="text-text-primary font-medium flex items-center">
                      <Star className="w-3.5 h-3.5 mr-1 text-stadium-gold-600 fill-stadium-gold-600" /> {selected.rating || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* AI RECOMMENDATION ADVISORY SUB-PANEL */}
                <div className="border-t border-stadium-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stadium-accent uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-stadium-accent" /> AI Deployment Advisory
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
                      <span>Gemini AI is processing workload and skills parameters...</span>
                    </div>
                  ) : aiError ? (
                    <div className="p-3 bg-stadium-critical/10 border border-stadium-critical/30 rounded text-stadium-critical text-xs">
                      <strong>Advisory Failed:</strong> {aiError}
                      <Button variant="outline" size="sm" onClick={() => recommendAssignments(selected)} className="w-full mt-2 text-stadium-critical hover:bg-stadium-critical/10">
                        Retry Advisory
                      </Button>
                    </div>
                  ) : recommendations && recommendations.volunteerId === selected.id ? (
                    <div className="space-y-3 bg-bg-secondary p-3 border border-stadium-border rounded text-[11px] text-text-secondary leading-relaxed">
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Recommended Zone & Task</strong>
                        <span className="text-text-primary font-bold">{recommendations.recommendedZone}</span>
                        <span className="text-text-muted block mt-0.5">{recommendations.recommendedTask}</span>
                      </div>
                      <div>
                        <strong className="block text-text-muted uppercase text-[9px] tracking-wide mb-0.5">Priority / Rationale</strong>
                        <p className="text-text-primary mt-0.5">{recommendations.explanation}</p>
                      </div>
                      
                      {recommendations.alternativeRecommendations.length > 0 && (
                        <div className="border-t border-stadium-border/40 pt-2 space-y-2">
                          <strong className="block text-text-muted uppercase text-[9px] tracking-wide">Alternative Scenarios</strong>
                          <div className="space-y-2">
                            {recommendations.alternativeRecommendations.map((alt, idx) => (
                              <div key={idx} className="bg-bg-panel p-2 rounded border border-stadium-border/40">
                                <span className="font-semibold text-text-primary block">{alt.recommendedZone}</span>
                                <span className="text-[10px] text-text-muted block">{alt.recommendedTask}</span>
                                <p className="text-[10px] text-text-secondary mt-1">{alt.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button variant="outline" size="sm" onClick={() => recommendAssignments(selected)} className="w-full text-text-secondary border-dashed mt-2">
                        Refresh Advisory
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => recommendAssignments(selected)} className="w-full font-semibold border-stadium-accent/40 text-stadium-accent hover:bg-stadium-accent/5">
                      Optimize Deployment with Gemini AI
                    </Button>
                  )}
                </div>

                <div className="border-t border-stadium-border pt-4 space-y-2">
                  <span className="block font-semibold text-text-muted uppercase tracking-wider">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pushToast('Deployment Dispatched', `${selected.firstName} ${selected.lastName} dispatched to North Gate ticket lines.`, 'success')}
                      className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5"
                    >
                      Dispatch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pushToast('Break Initiated', `${selected.firstName} ${selected.lastName} marked as ON BREAK. Relief volunteer notified.`, 'info')}
                      className="text-text-primary border-stadium-warning/50 hover:bg-stadium-warning/5"
                    >
                      Initiate Break
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-bg-panel p-6 text-center text-text-muted border border-stadium-border">
              Select a volunteer steward to inspect credentials and shift deployment diagnostics.
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
