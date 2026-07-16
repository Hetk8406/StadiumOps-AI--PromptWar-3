import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { IDashboardSummary } from '../../repositories/interfaces/dashboardRepository';
import { dashboardService } from '../../services';

interface DashboardState {
  summary: AsyncState<IDashboardSummary>;
  activities: AsyncState<string[]>;
}

type DashboardAction =
  | { type: 'START_FETCH_SUMMARY' }
  | { type: 'FETCH_SUMMARY_SUCCESS'; payload: IDashboardSummary }
  | { type: 'FETCH_SUMMARY_FAILURE'; payload: string }
  | { type: 'START_FETCH_ACTIVITIES' }
  | { type: 'FETCH_ACTIVITIES_SUCCESS'; payload: string[] }
  | { type: 'FETCH_ACTIVITIES_FAILURE'; payload: string };

const initialState: DashboardState = {
  summary: createInitialAsyncState<IDashboardSummary>(),
  activities: createInitialAsyncState<string[]>(),
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'START_FETCH_SUMMARY':
      return { ...state, summary: { ...state.summary, loading: true, error: null } };
    case 'FETCH_SUMMARY_SUCCESS':
      return { ...state, summary: { data: action.payload, loading: false, error: null } };
    case 'FETCH_SUMMARY_FAILURE':
      return { ...state, summary: { data: null, loading: false, error: action.payload } };
    case 'START_FETCH_ACTIVITIES':
      return { ...state, activities: { ...state.activities, loading: true, error: null } };
    case 'FETCH_ACTIVITIES_SUCCESS':
      return { ...state, activities: { data: action.payload, loading: false, error: null } };
    case 'FETCH_ACTIVITIES_FAILURE':
      return { ...state, activities: { data: null, loading: false, error: action.payload } };
    default:
      return state;
  }
}

interface DashboardContextProps extends DashboardState {
  fetchSummary: () => Promise<void>;
  fetchActivities: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const fetchSummary = useCallback(async () => {
    dispatch({ type: 'START_FETCH_SUMMARY' });
    try {
      const summary = await dashboardService.getDashboardSummary();
      dispatch({ type: 'FETCH_SUMMARY_SUCCESS', payload: summary });
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_SUMMARY_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    dispatch({ type: 'START_FETCH_ACTIVITIES' });
    try {
      const acts = await dashboardService.getLiveActivities();
      dispatch({ type: 'FETCH_ACTIVITIES_SUCCESS', payload: acts });
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_ACTIVITIES_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ ...state, fetchSummary, fetchActivities }}>
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboard(): DashboardContextProps {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
