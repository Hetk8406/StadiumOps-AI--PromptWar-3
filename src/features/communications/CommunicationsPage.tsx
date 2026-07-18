import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Radio,
  FileDown,
  Search,
  Plus,
  Sparkles,
  Inbox,
  Volume2,
  Smartphone,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCommunications, useTranslationAI } from '../../state';
import { BroadcastPriority, BroadcastStatus } from '../../domain/enums';
import { Broadcast } from '../../domain/models';
import { pushToast } from '../../notifications/notificationService';
import { communications } from '../../mocks/communications/communications';

/**
 * Communications Center Feature Page.
 * Integrates directly with useCommunications() centralized state and useTranslationAI() decision advisory tools.
 */
export default function CommunicationsPage(): React.JSX.Element {
  const { broadcasts, searchQuery, filterPriority, fetchBroadcasts, setSearchQuery, setPriorityFilter } = useCommunications();
  const { loading: translating, result: aiResult, error: aiError, translateMessage, clearTranslation } = useTranslationAI();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Broadcast and Emergency alert states
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [newBcTitle, setNewBcTitle] = useState('');
  const [newBcMessage, setNewBcMessage] = useState('');
  const [newBcPriority, setNewBcPriority] = useState<BroadcastPriority>(BroadcastPriority.LOW);
  const [newBcAudience, setNewBcAudience] = useState('All Visitors');

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [newEmMessage, setNewEmMessage] = useState('');

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBcTitle.trim() || !newBcMessage.trim()) return;

    let maxNum = 144;
    communications.forEach(bc => {
      const match = bc.id.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const id = `BC-2026-${maxNum + 1}`;

    const newBroadcast: Broadcast = {
      id,
      title: newBcTitle,
      message: newBcMessage,
      priority: newBcPriority,
      audience: newBcAudience,
      languages: ['en'],
      status: BroadcastStatus.SENT,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    communications.unshift(newBroadcast);
    fetchBroadcasts(searchQuery, filterPriority);

    setNewBcTitle('');
    setNewBcMessage('');
    setNewBcPriority(BroadcastPriority.LOW);
    setNewBcAudience('All Visitors');
    setIsBroadcastModalOpen(false);

    pushToast('New Broadcast Dispatch', `Broadcast message ${id} has been transmitted to all channels.`, 'success');
  };

  const handleCreateEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmMessage.trim()) return;

    let maxNum = 144;
    communications.forEach(bc => {
      const match = bc.id.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const id = `BC-2026-${maxNum + 1}`;

    const newBroadcast: Broadcast = {
      id,
      title: 'CRITICAL EMERGENCY WARNING',
      message: newEmMessage,
      priority: BroadcastPriority.CRITICAL,
      audience: 'All Visitors',
      languages: ['en', 'es', 'fr', 'pt', 'ar'],
      status: BroadcastStatus.DELIVERED,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    communications.unshift(newBroadcast);
    fetchBroadcasts(searchQuery, filterPriority);

    setNewEmMessage('');
    setIsEmergencyModalOpen(false);

    pushToast('Emergency Overlay Live', `Direct critical warning ${id} broadcasted via evacuation system.`, 'error');
  };

  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);

  const updateBroadcastStatus = (id: string, nextStatus: BroadcastStatus) => {
    const target = communications.find(c => c.id === id);
    if (target) {
      target.status = nextStatus;
      if (nextStatus === BroadcastStatus.SENT || nextStatus === BroadcastStatus.DELIVERED) {
        target.publishedAt = new Date().toISOString();
      }
    }
    fetchBroadcasts(searchQuery, filterPriority);
    if (selectedBroadcast && selectedBroadcast.id === id) {
      setSelectedBroadcast({
        ...selectedBroadcast,
        status: nextStatus,
        publishedAt: nextStatus === BroadcastStatus.SENT || nextStatus === BroadcastStatus.DELIVERED ? new Date().toISOString() : selectedBroadcast.publishedAt
      });
    }
  };

  // AI Translation form state
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [audience, setAudience] = useState('General Spectators');

  useEffect(() => {
    document.title = 'Communications Center - StadiumOps AI';
    fetchBroadcasts(searchQuery, filterPriority);
  }, [fetchBroadcasts, searchQuery, filterPriority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handleTranslateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    translateMessage(inputText, targetLang, audience);
  };

  const priorityColors: Record<BroadcastPriority, 'danger' | 'warning' | 'info' | 'neutral'> = {
    [BroadcastPriority.CRITICAL]: 'danger',
    [BroadcastPriority.HIGH]: 'danger',
    [BroadcastPriority.MEDIUM]: 'warning',
    [BroadcastPriority.LOW]: 'neutral',
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stadium-border pb-6">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Communications Center
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage stadium announcements, operational broadcasts and multilingual communications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="font-semibold"
            onClick={() => setIsBroadcastModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" /> New Broadcast
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="font-semibold"
            onClick={() => setIsEmergencyModalOpen(true)}
          >
            <AlertOctagon className="w-5 h-5 mr-2" /> Emergency Alert
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-text-secondary"
            onClick={() => {
              const dataStr = "StadiumOps AI Announcement Broadcast Log\n=======================================\nTotal Sent: 42 announcements\nNode status: Public display boards OK.";
              const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `stadiumops_announcement_logs_${Date.now()}.txt`;
              link.click();
              URL.revokeObjectURL(url);
              pushToast('Logs Exported', 'Broadcast log downloaded.', 'success');
            }}
          >
            <FileDown className="w-5 h-5 mr-2" /> Export Logs
          </Button>
        </div>
      </div>

      {/* ROW 1: SUMMARY TELEMETRY CARDS (FULL WIDTH RIBBON) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 bg-bg-panel border border-white/[0.04] flex flex-col justify-between hover:border-stadium-accent/30 transition-all min-h-[100px]">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Broadcasts Today</div>
          <div className="text-2xl font-black text-text-primary mt-1">42</div>
          <p className="text-[9px] text-text-muted mt-1">Shift logs combined</p>
        </Card>
        <Card className="p-4 bg-bg-panel border border-white/[0.04] flex flex-col justify-between hover:border-stadium-accent/30 transition-all min-h-[100px]">
          <div className="text-[10px] font-bold text-stadium-critical uppercase tracking-wider">Emergency Alerts</div>
          <div className="text-2xl font-black text-stadium-critical mt-1 font-mono">3</div>
          <p className="text-[9px] text-stadium-critical font-semibold mt-1">Immediate triggers</p>
        </Card>
        <Card className="p-4 bg-bg-panel border border-white/[0.04] flex flex-col justify-between hover:border-stadium-accent/30 transition-all min-h-[100px]">
          <div className="text-[10px] font-bold text-stadium-warning uppercase tracking-wider">Pending Queue</div>
          <div className="text-2xl font-black text-stadium-warning mt-1 font-mono">6</div>
          <p className="text-[9px] text-text-muted mt-1">Awaiting verification</p>
        </Card>
        <Card className="p-4 bg-bg-panel border border-white/[0.04] flex flex-col justify-between hover:border-stadium-accent/30 transition-all min-h-[100px]">
          <div className="text-[10px] font-bold text-stadium-info uppercase tracking-wider">Supported Languages</div>
          <div className="text-2xl font-black text-stadium-info mt-1">18</div>
          <p className="text-[9px] text-text-muted mt-1">Roster matches ready</p>
        </Card>
      </div>

      {/* FILTER TOOLBAR */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-bg-panel border border-stadium-border rounded-xl shadow-sm">
        <div className="flex items-center space-x-2 flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search broadcast message archives..."
            className="w-full bg-bg-secondary text-text-primary text-xs pl-10 pr-4 py-2 border border-stadium-border rounded focus:outline-none focus:ring-2 focus:ring-stadium-accent placeholder:text-text-muted"
            aria-label="Search broadcast logs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterPriority || ''}
            onChange={(e) => setPriorityFilter(e.target.value ? (e.target.value as BroadcastPriority) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Priority: All</option>
            {Object.values(BroadcastPriority).map((pri) => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
        </div>
      </form>

      {/* ROW 2: 70/30 GRID SPLIT */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column (70% width): Broadcast Center Logs */}
        <div className="w-full lg:w-[70%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Broadcast Center</h2>

          {broadcasts.loading ? (
            <div className="space-y-3" aria-hidden="true">
              <div className="h-24 bg-bg-panel border border-stadium-border rounded-xl animate-pulse" />
              <div className="h-24 bg-bg-panel border border-stadium-border rounded-xl animate-pulse" />
            </div>
          ) : broadcasts.data?.length === 0 ? (
            <div className="p-12 text-center bg-bg-panel border border-dashed border-stadium-border rounded-md flex flex-col items-center justify-center">
              <Inbox className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-base font-semibold text-text-primary">No Broadcasts Available</h3>
              <p className="text-xs text-text-muted mt-2">Adjust search settings to look up old logs.</p>
            </div>
          ) : (
            <div className="bg-[#14171d] border border-white/[0.04] rounded-xl overflow-hidden shadow-subtle">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stadium-border bg-[#0a0b0d]/60 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 z-10">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Title & Audience</th>
                      <th className="py-2.5 px-3">Message</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Sent</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-white/[0.02]">
                    {broadcasts.data
                      ?.slice()
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((bc: Broadcast) => {
                        return (
                          <tr
                            key={bc.id}
                            onClick={() => setSelectedBroadcast(bc)}
                            className={`cursor-pointer hover:bg-white/[0.02] transition-colors ${
                              selectedBroadcast?.id === bc.id ? 'bg-stadium-accent/10 border-l-2 border-stadium-accent' : ''
                            }`}
                          >
                            <td className="py-2 px-3 font-mono font-bold text-text-muted">{bc.id}</td>
                            <td className="py-2 px-3 font-bold text-text-primary">
                              {bc.title}
                              <span className="text-[10px] text-text-muted font-normal block">Audience: {bc.audience}</span>
                            </td>
                            <td className="py-2 px-3 text-text-secondary max-w-[250px] truncate" title={bc.message}>
                              {bc.message}
                            </td>
                            <td className="py-2 px-3">
                              <Badge variant={priorityColors[bc.priority]}>{bc.priority}</Badge>
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-bg-secondary text-text-secondary uppercase">
                                {bc.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-text-muted font-mono">
                              {new Date(bc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        {/* Right Column (30% width): Broadcast Details HUD */}
        <div className="w-full lg:w-[30%] space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Broadcast Details HUD</h2>
          
          {selectedBroadcast ? (
            <Card className="bg-bg-panel text-xs text-text-secondary space-y-4 p-5 border border-stadium-border rounded-xl">
              <div className="flex items-center justify-between border-b border-stadium-border pb-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary leading-tight">{selectedBroadcast.title}</h3>
                  <span className="text-[10px] font-mono text-text-muted block mt-1">{selectedBroadcast.id}</span>
                </div>
                <Badge variant={priorityColors[selectedBroadcast.priority]}>{selectedBroadcast.priority}</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block font-semibold text-text-muted uppercase tracking-wider mb-1">Message Body</span>
                  <p className="leading-relaxed bg-bg-secondary p-3 border border-stadium-border rounded text-text-secondary">
                    {selectedBroadcast.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-1">Status</span>
                    <select
                      value={selectedBroadcast.status}
                      onChange={(e) => updateBroadcastStatus(selectedBroadcast.id, e.target.value as BroadcastStatus)}
                      className="bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer font-bold uppercase tracking-wider w-full"
                    >
                      {Object.values(BroadcastStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Target Audience</span>
                    <span className="text-text-primary font-medium">{selectedBroadcast.audience}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Created At</span>
                    <span className="text-text-primary font-medium font-mono">
                      {new Date(selectedBroadcast.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-text-muted uppercase tracking-wider mb-0.5">Published At</span>
                    <span className="text-text-primary font-medium font-mono">
                      {selectedBroadcast.publishedAt
                        ? new Date(selectedBroadcast.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-stadium-border pt-4 space-y-2">
                  <span className="block font-semibold text-text-muted uppercase tracking-wider">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateBroadcastStatus(selectedBroadcast.id, BroadcastStatus.SENT);
                        pushToast('Broadcast Transmitted', `Broadcast ${selectedBroadcast.id} status updated to SENT.`, 'success');
                      }}
                      className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5"
                    >
                      Send Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateBroadcastStatus(selectedBroadcast.id, BroadcastStatus.DRAFT);
                        pushToast('Broadcast Drafted', `Broadcast ${selectedBroadcast.id} status updated to DRAFT.`, 'info');
                      }}
                      className="text-text-primary border-white/[0.08] hover:bg-white/[0.02]"
                    >
                      Draft Mode
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-bg-panel p-6 text-center text-text-muted border border-stadium-border rounded-xl">
              Select a broadcast from the queue to view detailed metrics and trigger quick dispatch controls.
            </Card>
          )}
        </div>

      </div>

      {/* ROW 3: LOWER PANELS (STREAMLINED CHANNELS & AI TRANSLATION PORTAL) */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full pt-2">
        
        {/* Operational Channels Feed (30% width) */}
        <div className="w-full lg:w-[30%]">
          <Card className="flex flex-col p-5 space-y-4 h-full border border-stadium-border rounded-xl bg-bg-panel">
            <CardHeader className="p-0">
              <CardTitle className="text-xs uppercase tracking-wider text-text-muted font-bold">Operational Channels Feed</CardTitle>
            </CardHeader>
            <div className="flex-1 space-y-3 text-xs mt-2">
              <div className="flex justify-between items-center p-2.5 bg-bg-secondary border border-stadium-border rounded">
                <span className="font-semibold text-text-primary flex items-center">
                  <Volume2 className="w-4 h-4 mr-2 text-stadium-accent" /> Public Display Boards
                </span>
                <span className="text-stadium-success font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-bg-secondary border border-stadium-border rounded">
                <span className="font-semibold text-text-primary flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-stadium-accent" /> Mobile App Notification
                </span>
                <span className="text-stadium-success font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-bg-secondary border border-stadium-border rounded">
                <span className="font-semibold text-text-primary flex items-center">
                  <Radio className="w-4 h-4 mr-2 text-stadium-accent" /> Volunteer Radios (HF)
                </span>
                <span className="text-stadium-success font-bold">ONLINE</span>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Translation Tone Adapter Portal (70% width) */}
        <div className="w-full lg:w-[70%]">
          <Card className="border-dashed border-stadium-accent bg-stadium-accent/5 p-5 space-y-4 text-xs text-text-secondary rounded-xl h-full">
            <div className="flex items-center justify-between border-b border-stadium-border/60 pb-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-stadium-accent animate-pulse" />
                <strong className="text-text-primary text-xs uppercase tracking-wider">AI Translation & Tone Adapter</strong>
              </div>
              {aiResult && (
                <span className="text-[10px] text-text-muted">
                  Confidence: <strong className="text-stadium-success">{aiResult.confidenceCategory} ({Math.round(aiResult.confidence * 100)}%)</strong>
                </span>
              )}
            </div>

            <form onSubmit={handleTranslateSubmit} className="space-y-4">
              <div>
                <label htmlFor="message-input" className="block font-semibold text-text-muted uppercase text-[9px] mb-1">Compose Operational Message</label>
                <textarea
                  id="message-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. Please proceed to Gate C. Incident INC-402 medical team dispatched."
                  className="w-full bg-bg-secondary text-text-primary text-xs p-2.5 border border-stadium-border rounded focus:outline-none focus:ring-1 focus:ring-stadium-accent min-h-[64px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target-lang" className="block font-semibold text-text-muted uppercase text-[9px] mb-1">Target Language</label>
                  <select
                    id="target-lang"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-bg-secondary text-text-primary text-xs p-2 border border-stadium-border rounded focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Korean">Korean</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="audience-select" className="block font-semibold text-text-muted uppercase text-[9px] mb-1">Target Audience Tone</label>
                  <select
                    id="audience-select"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-bg-secondary text-text-primary text-xs p-2 border border-stadium-border rounded focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                  >
                    <option value="General Spectators">General Spectators</option>
                    <option value="Volunteers">Volunteers</option>
                    <option value="Medical Teams">Medical Teams</option>
                    <option value="Security Personnel">Security Personnel</option>
                    <option value="Accessibility Staff">Accessibility Staff</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full font-semibold border-stadium-accent text-stadium-accent hover:bg-stadium-accent/10 mt-1"
                disabled={translating}
              >
                {translating ? 'Gemini AI translating...' : 'Translate & Refine Announcement'}
              </Button>
            </form>

            {aiError && (
              <div className="p-2.5 bg-stadium-critical/10 border border-stadium-critical/30 rounded text-stadium-critical mt-2">
                <strong>Translation Error:</strong> {aiError}
              </div>
            )}

            {aiResult && (
              <div className="space-y-3 bg-bg-secondary p-3 border border-stadium-border rounded mt-3 text-[11px] leading-relaxed text-text-secondary">
                <div>
                  <strong className="block text-text-muted uppercase text-[9px] tracking-wide">Translated Message ({aiResult.targetLanguage})</strong>
                  <p className="text-text-primary font-medium mt-0.5">{aiResult.translatedMessage}</p>
                </div>

                <div>
                  <strong className="block text-text-muted uppercase text-[9px] tracking-wide">Refined Version (Audience Tuned)</strong>
                  <p className="text-text-primary mt-0.5">{aiResult.refinedVersion}</p>
                </div>

                {aiResult.terminologyNotes.length > 0 && (
                  <div>
                    <strong className="block text-text-muted uppercase text-[9px] tracking-wide">Operational Terminology Checks</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiResult.terminologyNotes.map((note, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-stadium-accent/15 text-stadium-accent text-[9px]">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-text-muted border-t border-stadium-border/40 pt-2">
                  <span>Detected source: <strong>{aiResult.detectedLanguage}</strong></span>
                  <button type="button" onClick={clearTranslation} className="text-stadium-accent font-semibold hover:underline">
                    Clear Result
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* 2. NEW BROADCAST OVERLAY MODAL */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#14171d] border border-white/[0.08] rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stadium-border pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Compose New Broadcast</h3>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateBroadcast} className="space-y-4 text-xs text-text-secondary">
              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Broadcast Title</label>
                <input
                  type="text"
                  required
                  value={newBcTitle}
                  onChange={(e) => setNewBcTitle(e.target.value)}
                  placeholder="e.g. Traffic Congestion Advisory"
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-text-muted font-bold uppercase tracking-wider">Priority</label>
                  <select
                    value={newBcPriority}
                    onChange={(e) => setNewBcPriority(e.target.value as BroadcastPriority)}
                    className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                  >
                    {Object.values(BroadcastPriority).map((pri) => (
                      <option key={pri} value={pri}>{pri}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-text-muted font-bold uppercase tracking-wider">Target Audience</label>
                  <select
                    value={newBcAudience}
                    onChange={(e) => setNewBcAudience(e.target.value)}
                    className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent cursor-pointer"
                  >
                    {['All Visitors', 'All Stewards', 'Medical Personnel', 'Public Fan Zone', 'Transit Commuters', 'Volunteer Teams'].map((aud) => (
                      <option key={aud} value={aud}>{aud}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-text-muted font-bold uppercase tracking-wider">Announcement Message</label>
                <textarea
                  required
                  rows={4}
                  value={newBcMessage}
                  onChange={(e) => setNewBcMessage(e.target.value)}
                  placeholder="Write the announcement message details to broadcast..."
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBroadcastModalOpen(false)}
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
                  Transmit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EMERGENCY ALERT OVERLAY MODAL */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1c1214] border border-stadium-critical/30 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stadium-critical/20 pb-3">
              <h3 className="text-sm font-bold text-stadium-critical uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-stadium-critical" /> CRITICAL EMERGENCY TRIGGER
              </h3>
              <button onClick={() => setIsEmergencyModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateEmergency} className="space-y-4 text-xs text-text-secondary">
              <div className="space-y-1">
                <label className="block text-stadium-critical font-bold uppercase tracking-wider">Evacuation / Safety Message</label>
                <textarea
                  required
                  rows={4}
                  value={newEmMessage}
                  onChange={(e) => setNewEmMessage(e.target.value)}
                  placeholder="e.g. CRITICAL ALERT: Emergency evacuation protocols activated. Proceed to the nearest exit gates immediately."
                  className="w-full bg-[#0a0b0d] text-text-primary border border-stadium-critical/40 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-critical resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="font-bold uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  className="bg-stadium-critical hover:bg-red-700 text-white font-bold uppercase tracking-wider"
                >
                  Broadcast Evacuation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
