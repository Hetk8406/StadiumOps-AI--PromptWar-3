import React, { useEffect, useState } from 'react';
import {
  Plus,
  RefreshCw,
  Search,
  Inbox,
  Star,
  Sparkles,
  X,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useVolunteers, useVolunteerAI } from '../../state';
import { VolunteerRole, VolunteerStatus } from '../../domain/enums';
import { Volunteer } from '../../domain/models';
import { pushToast } from '../../notifications/notificationService';
import { volunteers } from '../../mocks/volunteers/volunteers';

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

  // Register Volunteer modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newRole, setNewRole] = useState<VolunteerRole>(VolunteerRole.SECURITY);
  const [newZone, setNewZone] = useState('North Stand');
  const [newExperience, setNewExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Team Leader'>('Beginner');
  const [newStatus, setNewStatus] = useState<VolunteerStatus>(VolunteerStatus.AVAILABLE);

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
    setIsModalOpen(true);
  };

  const handleSubmitVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim()) return;

    // Numerical ordered ID generation
    let maxNum = 199; // default baseline in mocks
    volunteers.forEach(v => {
      const match = v.id.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    const id = `VOL-2026-${maxNum + 1}`;

    const newVolunteer: Volunteer = {
      id,
      firstName: newFirstName,
      lastName: newLastName,
      role: newRole,
      languages: ['en'],
      status: newStatus,
      currentZone: newZone,
      experienceLevel: newExperience,
      certifications: ['General Duty Guide'],
      contact: '+1-555-010-2026',
      availability: newStatus === VolunteerStatus.AVAILABLE,
      rating: 4.5,
    };

    volunteers.unshift(newVolunteer);
    fetchVolunteers(searchQuery, filterRole, filterStatus);
    selectVolunteer(newVolunteer);

    // Reset Form
    setNewFirstName('');
    setNewLastName('');
    setNewRole(VolunteerRole.SECURITY);
    setNewZone('North Stand');
    setNewExperience('Beginner');
    setNewStatus(VolunteerStatus.AVAILABLE);
    setIsModalOpen(false);

    pushToast(
      `New Volunteer Registered: ${id}`,
      'Successfully added to active tournament roster database.',
      'success'
    );
  };

  const updateVolunteerStatus = (id: string, nextStatus: VolunteerStatus) => {
    const target = volunteers.find(v => v.id === id);
    if (target) {
      target.status = nextStatus;
      target.availability = nextStatus === VolunteerStatus.AVAILABLE;
    }
    fetchVolunteers(searchQuery, filterRole, filterStatus);
    if (selected && selected.id === id) {
      selectVolunteer({ ...selected, status: nextStatus, availability: nextStatus === VolunteerStatus.AVAILABLE });
    }
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
            <div className="bg-[#14171d] border border-white/[0.04] rounded-xl overflow-hidden shadow-subtle">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stadium-border bg-[#0a0b0d]/60 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 z-10">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Zone</th>
                      <th className="py-2.5 px-3">Exp</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-white/[0.02]">
                    {list.data
                      ?.slice()
                      .sort((a, b) => {
                        const numA = parseInt(a.id.match(/\d+$/)?.[0] || '0', 10);
                        const numB = parseInt(b.id.match(/\d+$/)?.[0] || '0', 10);
                        return numB - numA;
                      })
                      .map((v: Volunteer) => {
                        const isSelected = selected?.id === v.id;
                        return (
                          <tr
                            key={v.id}
                            onClick={() => selectVolunteer(v)}
                            className={`cursor-pointer hover:bg-white/[0.02] transition-colors ${
                              isSelected ? 'bg-stadium-accent/10 border-l-2 border-stadium-accent' : ''
                            }`}
                          >
                            <td className="py-2 px-3 font-mono font-bold text-text-muted">{v.id}</td>
                            <td className="py-2 px-3 font-bold text-text-primary">
                              {v.firstName} {v.lastName} <span className="text-[10px] text-text-muted font-normal block">{v.role}</span>
                            </td>
                            <td className="py-2 px-3 text-text-secondary">{v.currentZone}</td>
                            <td className="py-2 px-3 text-text-muted">{v.experienceLevel}</td>
                            <td className="py-2 px-3">
                              <Badge variant={statusColors[v.status]}>{v.status}</Badge>
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
                <select
                  value={selected.status}
                  onChange={(e) => updateVolunteerStatus(selected.id, e.target.value as VolunteerStatus)}
                  className="bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer font-bold uppercase tracking-wider"
                >
                  {Object.values(VolunteerStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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
                      onClick={() => {
                        updateVolunteerStatus(selected.id, VolunteerStatus.ASSIGNED);
                        pushToast('Deployment Dispatched', `${selected.firstName} ${selected.lastName} dispatched to North Gate ticket lines.`, 'success');
                      }}
                      className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5"
                    >
                      Dispatch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateVolunteerStatus(selected.id, VolunteerStatus.BREAK);
                        pushToast('Break Initiated', `${selected.firstName} ${selected.lastName} marked as ON BREAK. Relief volunteer notified.`, 'info');
                      }}
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

      {/* 2. REGISTER VOLUNTEER OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#14171d] border border-white/[0.08] rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stadium-border pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Register New Volunteer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitVolunteer} className="space-y-4 text-xs text-text-secondary">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-text-muted font-bold uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Jane"
                    className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-text-muted font-bold uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as VolunteerRole)}
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                >
                  {Object.values(VolunteerRole).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Current Zone</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                >
                  {['North Stand', 'South Stand', 'East Stand', 'West Stand', 'VIP Area', 'Parking Zone A', 'Fan Zone B', 'Media Center'].map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-text-muted font-bold uppercase tracking-wider">Experience Level</label>
                  <select
                    value={newExperience}
                    onChange={(e) => setNewExperience(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Team Leader')}
                    className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                  >
                    {['Beginner', 'Intermediate', 'Advanced', 'Team Leader'].map((exp) => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-text-muted font-bold uppercase tracking-wider">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as VolunteerStatus)}
                    className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                  >
                    {Object.values(VolunteerStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
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
                  Register Volunteer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
