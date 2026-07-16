import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { Report } from '../../domain/models';
import { ReportType } from '../../domain/enums';
import { reportService } from '../../services';

interface ReportState {
  reports: AsyncState<Report[]>;
  filterType?: ReportType;
  searchQuery: string;
}

type ReportAction =
  | { type: 'START_FETCH_REPORTS' }
  | { type: 'FETCH_REPORTS_SUCCESS'; payload: Report[] }
  | { type: 'FETCH_REPORTS_FAILURE'; payload: string }
  | { type: 'SET_TYPE_FILTER'; payload: ReportType | undefined }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: ReportState = {
  reports: createInitialAsyncState<Report[]>([]),
  searchQuery: '',
};

function reportReducer(state: ReportState, action: ReportAction): ReportState {
  switch (action.type) {
    case 'START_FETCH_REPORTS':
      return { ...state, reports: { ...state.reports, loading: true, error: null } };
    case 'FETCH_REPORTS_SUCCESS':
      return { ...state, reports: { data: action.payload, loading: false, error: null } };
    case 'FETCH_REPORTS_FAILURE':
      return { ...state, reports: { data: [], loading: false, error: action.payload } };
    case 'SET_TYPE_FILTER':
      return { ...state, filterType: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

interface ReportContextProps extends ReportState {
  fetchReports: (type?: ReportType) => Promise<void>;
  setTypeFilter: (type?: ReportType) => void;
  setSearchQuery: (query: string) => void;
}

const ReportContext = createContext<ReportContextProps | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  const fetchReports = useCallback(async (type?: ReportType) => {
    dispatch({ type: 'START_FETCH_REPORTS' });
    try {
      const res = type ? await reportService.getReportsByType(type) : await reportService.getAllReports();
      dispatch({ type: 'FETCH_REPORTS_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_REPORTS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const setTypeFilter = useCallback((type?: ReportType) => {
    dispatch({ type: 'SET_TYPE_FILTER', payload: type });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  return (
    <ReportContext.Provider value={{ ...state, fetchReports, setTypeFilter, setSearchQuery }}>
      {children}
    </ReportContext.Provider>
  );
};

export function useReports(): ReportContextProps {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}
