import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Plus,
  Search,
  Inbox,
  Sparkles,
  Printer,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useReports } from '../../state';
import { pushToast } from '../../notifications/notificationService';
import { ReportType } from '../../domain/enums';
import { Report } from '../../domain/models';

/**
 * Historical Reports and Shift Auditing View.
 * Integrates directly with useReports() hook.
 */
export default function ReportsPage(): React.JSX.Element {
  const { reports, filterType, searchQuery, fetchReports, setTypeFilter, setSearchQuery } = useReports();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    document.title = 'Reports & Analytics - StadiumOps AI';
    fetchReports(filterType);
  }, [fetchReports, filterType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handleRefresh = () => {
    fetchReports(filterType);
  };

  const filteredReports = reports.data?.filter((rep: Report) =>
    rep.title.toLowerCase().includes(localSearch.toLowerCase()) ||
    rep.format.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stadium-border pb-6">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Reports & Analytics
          </h1>
          <p className="text-sm text-text-muted mt-1">
            View operational summaries, historical activity and export reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="font-semibold"
            onClick={() => pushToast('Report Generation Started', 'Initiating data aggregation for match day summary report.', 'success')}
          >
            <Plus className="w-5 h-5 mr-2" /> Generate Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pushToast('Report Schedule Active', 'Configured weekly automatic delivery of ingress wait time audits.', 'info')}
            className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5"
          >
            Schedule Report
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="text-text-secondary">
            <RefreshCw className={`w-5 h-5 ${reports.loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS & EXPORT TELEMETRY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-bg-panel flex flex-col justify-between min-h-[100px]">
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase">Reports Generated</div>
            <div className="text-2xl font-extrabold text-text-primary mt-2">186</div>
          </div>
          <p className="text-[10px] text-text-muted mt-1">Active match shift logs</p>
        </Card>
        <Card className="p-4 bg-bg-panel flex flex-col justify-between min-h-[100px]">
          <div>
            <div className="text-xs font-semibold text-stadium-accent uppercase">Today's Reports</div>
            <div className="text-2xl font-extrabold text-stadium-accent mt-2">12</div>
          </div>
          <p className="text-[10px] text-text-muted mt-1">Ready for download</p>
        </Card>
        <Card className="p-4 bg-bg-panel flex flex-col justify-between min-h-[100px]">
          <div className="text-xs font-semibold text-text-primary uppercase tracking-wide">Export Telemetry Center</div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const content = "StadiumOps AI Report PDF Export Simulation\n=========================================\nReport ID: REP-104\nTitle: Match Day Summary Log\nStatus: Verified.";
                const blob = new Blob([content], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `stadiumops_report_${Date.now()}.pdf`;
                link.click();
                URL.revokeObjectURL(url);
                pushToast('Download Complete', 'PDF report downloaded successfully.', 'success');
              }}
              className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5 justify-center py-1 text-[10px]"
            >
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const content = "Report ID,Name,Generated Date,Format,Status\nREP-101,Weather Ingress Audit,2026-07-16,CSV,Completed";
                const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `stadiumops_report_${Date.now()}.csv`;
                link.click();
                URL.revokeObjectURL(url);
                pushToast('Export Complete', 'CSV report downloaded successfully.', 'success');
              }}
              className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5 justify-center py-1 text-[10px]"
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.print();
                pushToast('Print Command Sent', 'Opening browser print dialogue.', 'info');
              }}
              className="text-text-primary border-stadium-accent/50 hover:bg-stadium-accent/5 justify-center py-1 text-[10px]"
            >
              <Printer className="w-3.5 h-3.5 mr-1" /> Print
            </Button>
          </div>
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
            placeholder="Search report name, ID, file extension..."
            className="w-full bg-bg-secondary text-text-primary text-xs pl-10 pr-4 py-2 border border-stadium-border rounded focus:outline-none focus:ring-2 focus:ring-stadium-accent placeholder:text-text-muted"
            aria-label="Filter report logs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType || ''}
            onChange={(e) => setTypeFilter(e.target.value ? (e.target.value as ReportType) : undefined)}
            className="bg-bg-secondary text-text-primary text-xs px-3 py-2 border border-stadium-border rounded cursor-pointer"
          >
            <option value="">Category: All</option>
            {Object.values(ReportType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </form>

      {/* DUAL WORKSPACE SPLIT PANEL */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">Recent Reports Logs</h2>

        {reports.loading ? (
          <div className="space-y-3 animate-pulse" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-bg-panel border border-stadium-border rounded" />
            ))}
          </div>
        ) : filteredReports?.length === 0 ? (
          <div className="p-12 text-center bg-bg-panel border border-dashed border-stadium-border rounded flex flex-col items-center justify-center">
            <Inbox className="w-12 h-12 text-text-muted mb-4" />
            <h3 className="text-base font-semibold text-text-primary">No Reports Available</h3>
            <p className="text-xs text-text-muted mt-2">Adjust search settings to query history.</p>
          </div>
        ) : (
          <div className="border border-stadium-border rounded-md bg-bg-panel overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" aria-label="Recent reports list table">
              <thead>
                <tr className="border-b border-stadium-border bg-bg-secondary text-text-muted font-bold">
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Generated</th>
                  <th className="p-3">Format</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stadium-border text-text-secondary">
                {filteredReports?.map((rep: Report) => (
                  <tr key={rep.id} className="hover:bg-bg-secondary/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-text-muted">{rep.id}</td>
                    <td className="p-3 font-semibold text-text-primary">{rep.title}</td>
                    <td className="p-3">{new Date(rep.generatedAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Badge variant="neutral">{rep.format}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant={rep.status === 'Completed' ? 'success' : 'warning'}>
                        {rep.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 7: ANALYTICS PREVIEW AI */}
      <Card className="bg-bg-panel border-dashed border-stadium-accent bg-stadium-accent/5 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-stadium-accent/20 border border-stadium-accent/40 rounded-md">
            <Sparkles className="w-6 h-6 text-stadium-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Advanced Operational Analytics
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
              AI-generated post-match analytics, shift handovers summary, and transit prediction charts will be introduced in future phases. Gemini models will summarize incident records and telemetry logs into structured reports.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
