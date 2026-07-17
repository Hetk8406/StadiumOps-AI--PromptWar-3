// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ReportProvider, useReports } from './reportContext';
import { ReportType } from '../../domain/enums';

// Mock the reportService
vi.mock('../../services', () => {
  return {
    reportService: {
      getAllReports: vi.fn(() => Promise.resolve([
        { id: 'REP-101', title: 'Daily Incident Audit', generatedAt: '2026-07-16T12:00:00Z', format: 'PDF', status: 'Completed' }
      ])),
      getReportsByType: vi.fn((type) => Promise.resolve([
        { id: 'REP-102', title: `Filtered ${type} Log`, generatedAt: '2026-07-16T13:00:00Z', format: 'CSV', status: 'Completed' }
      ]))
    }
  };
});

import { reportService } from '../../services';

const TestComponent = () => {
  const { reports, filterType, searchQuery, fetchReports, setTypeFilter, setSearchQuery } = useReports();
  const reportsList = reports.data || [];
  return (
    <div>
      <div data-testid="loading">{reports.loading ? 'loading' : 'idle'}</div>
      <div data-testid="search">{searchQuery}</div>
      <div data-testid="filter">{filterType || 'none'}</div>
      <div data-testid="count">{reportsList.length}</div>
      {reportsList.map((r) => (
        <div key={r.id} data-testid="report-title">{r.title}</div>
      ))}
      <button onClick={() => fetchReports()} data-testid="btn-fetch">Fetch All</button>
      <button onClick={() => fetchReports(ReportType.INCIDENT)} data-testid="btn-fetch-type">Fetch Type</button>
      <button onClick={() => setTypeFilter(ReportType.VOLUNTEER)} data-testid="btn-set-filter">Set Filter</button>
      <button onClick={() => setSearchQuery('search-term')} data-testid="btn-set-search">Set Search</button>
    </div>
  );
};

describe('useReports Context and Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('provides default reports context values', () => {
    render(
      <ReportProvider>
        <TestComponent />
      </ReportProvider>
    );

    expect(screen.getByTestId('loading').textContent).toBe('idle');
    expect(screen.getByTestId('search').textContent).toBe('');
    expect(screen.getByTestId('filter').textContent).toBe('none');
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('updates search query and type filter', () => {
    render(
      <ReportProvider>
        <TestComponent />
      </ReportProvider>
    );

    fireEvent.click(screen.getByTestId('btn-set-search'));
    expect(screen.getByTestId('search').textContent).toBe('search-term');

    fireEvent.click(screen.getByTestId('btn-set-filter'));
    expect(screen.getByTestId('filter').textContent).toBe(ReportType.VOLUNTEER);
  });

  it('fetches all reports successfully', async () => {
    render(
      <ReportProvider>
        <TestComponent />
      </ReportProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-fetch'));
    });

    expect(reportService.getAllReports).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('report-title').textContent).toBe('Daily Incident Audit');
  });

  it('fetches reports by type successfully', async () => {
    render(
      <ReportProvider>
        <TestComponent />
      </ReportProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-fetch-type'));
    });

    expect(reportService.getReportsByType).toHaveBeenCalledWith(ReportType.INCIDENT);
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('report-title').textContent).toBe(`Filtered ${ReportType.INCIDENT} Log`);
  });

  it('throws error when used outside of ReportProvider', () => {
    // Suppress console.error during expected error boundary test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow('useReports must be used within a ReportProvider');
    
    consoleError.mockRestore();
  });
});
