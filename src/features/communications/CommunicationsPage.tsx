import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Radio,
  FileDown,
  RefreshCw,
  Search,
  Plus,
  Sparkles,
  Inbox,
  Volume2,
  Smartphone,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCommunications, useTranslationAI } from '../../state';
import { BroadcastPriority } from '../../domain/enums';
import { Broadcast } from '../../domain/models';

/**
 * Communications Center Feature Page.
 * Integrates directly with useCommunications() centralized state and useTranslationAI() decision advisory tools.
 */
export default function CommunicationsPage(): React.JSX.Element {
  const { broadcasts, searchQuery, filterPriority, fetchBroadcasts, setSearchQuery, setPriorityFilter } = useCommunications();
  const { loading: translating, result: aiResult, error: aiError, translateMessage, clearTranslation } = useTranslationAI();
  const [localSearch, setLocalSearch] = useState(searchQuery);

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

  const handleRefresh = () => {
    fetchBroadcasts(searchQuery, filterPriority);
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
          <Button variant="primary" size="sm" className="font-semibold" disabled>
            <Plus className="w-4 h-4 mr-1.5" /> New Broadcast
          </Button>
          <Button variant="danger" size="sm" className="font-semibold" disabled>
            <AlertOctagon className="w-4 h-4 mr-1.5" /> Emergency Alert
          </Button>
          <Button variant="outline" size="sm" className="text-text-secondary" disabled>
            <FileDown className="w-4 h-4 mr-1.5" /> Export Logs
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="text-text-secondary">
            <RefreshCw className={`w-4 h-4 ${broadcasts.loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-text-muted uppercase">Broadcasts Today</div>
          <div className="text-2xl font-extrabold text-text-primary mt-2">42</div>
          <p className="text-[10px] text-text-muted mt-1">Shift logs combined</p>
        </Card>
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-stadium-critical uppercase">Emergency Alerts</div>
          <div className="text-2xl font-extrabold text-stadium-critical mt-2">3</div>
          <p className="text-[10px] text-stadium-critical font-semibold mt-1">Immediate triggers</p>
        </Card>
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-stadium-warning uppercase">Pending Queue</div>
          <div className="text-2xl font-extrabold text-stadium-warning mt-2">6</div>
          <p className="text-[10px] text-text-muted mt-1">Awaiting verification</p>
        </Card>
        <Card className="p-4 bg-bg-panel">
          <div className="text-xs font-semibold text-stadium-info uppercase">Supported Languages</div>
          <div className="text-2xl font-extrabold text-stadium-info mt-2">18</div>
          <p className="text-[10px] text-text-muted mt-1">Roster matches ready</p>
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

      {/* DUAL WORKSPACE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: BROADCAST CENTER CARDS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Broadcast Center</h2>

          {broadcasts.loading ? (
            <div className="space-y-3" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 bg-bg-panel border border-stadium-border rounded-md animate-pulse p-4" />
              ))}
            </div>
          ) : broadcasts.data?.length === 0 ? (
            <div className="p-12 text-center bg-bg-panel border border-dashed border-stadium-border rounded-md flex flex-col items-center justify-center">
              <Inbox className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-base font-semibold text-text-primary">No Broadcasts Available</h3>
              <p className="text-xs text-text-muted mt-2">Adjust search settings to look up old logs.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {broadcasts.data?.map((bc: Broadcast) => (
                <div key={bc.id} className="p-4 bg-bg-panel border border-stadium-border rounded-md hover:border-stadium-accent transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-text-muted">{bc.id}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={priorityColors[bc.priority]}>{bc.priority}</Badge>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-bg-secondary text-text-secondary uppercase">
                        {bc.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-text-primary mt-2">{bc.title}</h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed bg-bg-secondary p-2.5 rounded border border-stadium-border/40">
                    {bc.message}
                  </p>

                  <div className="flex flex-wrap items-center justify-between mt-3 text-xs text-text-muted">
                    <span>Target: <strong className="text-text-secondary">{bc.audience}</strong></span>
                    <span>Sent: {new Date(bc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REUSABLE TEMPLATES */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Quick Templates Selection</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            <Card className="bg-bg-panel p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-text-primary text-xs uppercase tracking-wide">Emergency Evacuation</strong>
                <Badge variant="danger">Critical</Badge>
              </div>
              <p className="text-xs text-text-muted">Directs crowd flow to emergency safety gates immediately.</p>
              <Button variant="danger" size="sm" className="w-full font-semibold uppercase tracking-wider text-[11px]" disabled>
                Use Template
              </Button>
            </Card>

            <Card className="bg-bg-panel p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-text-primary text-xs uppercase tracking-wide">Medical Call Assist</strong>
                <Badge variant="warning">High</Badge>
              </div>
              <p className="text-xs text-text-muted">Requesting immediate medical unit details dispatch.</p>
              <Button variant="outline" size="sm" className="w-full text-text-secondary text-[11px]" disabled>
                Use Template
              </Button>
            </Card>
          </div>
        </div>

      </div>

      {/* LOWER PANELS: LANGUAGE CENTER & AI WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OPERATIONAL CHANNELS FEED */}
        <Card className="flex flex-col p-4 space-y-3">
          <CardHeader className="p-0">
            <CardTitle className="text-xs uppercase tracking-wider text-text-muted font-bold">Operational Channels Feed</CardTitle>
          </CardHeader>
          <div className="flex-1 space-y-3 text-xs">
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

        {/* AI WORKFLOW PORTAL (INTERACTIVE TRANSLATION ADVISOR) */}
        <Card className="lg:col-span-2 border-dashed border-stadium-accent bg-stadium-accent/5 p-4 space-y-3 text-xs text-text-secondary">
          <div className="flex items-center justify-between border-b border-stadium-border pb-2.5">
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

          <form onSubmit={handleTranslateSubmit} className="space-y-3">
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="target-lang" className="block font-semibold text-text-muted uppercase text-[9px] mb-1">Target Language</label>
                <select
                  id="target-lang"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full bg-bg-secondary text-text-primary text-xs p-2 border border-stadium-border rounded focus:outline-none"
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
                  className="w-full bg-bg-secondary text-text-primary text-xs p-2 border border-stadium-border rounded focus:outline-none"
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
              className="w-full font-semibold border-stadium-accent text-stadium-accent hover:bg-stadium-accent/10"
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
  );
}
