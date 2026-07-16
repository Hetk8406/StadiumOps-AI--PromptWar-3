import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { Incident } from '../../domain/models';
import { IncidentSeverity, IncidentStatus } from '../../domain/enums';
import { incidentService } from '../../services';

interface IncidentState {
  list: AsyncState<Incident[]>;
  selected: Incident | null;
  searchQuery: string;
  filterStatus?: IncidentStatus;
  filterSeverity?: IncidentSeverity;
}

type IncidentAction =
  | { type: 'START_FETCH_LIST' }
  | { type: 'FETCH_LIST_SUCCESS'; payload: Incident[] }
  | { type: 'FETCH_LIST_FAILURE'; payload: string }
  | { type: 'SELECT_INCIDENT'; payload: Incident | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: IncidentStatus | undefined }
  | { type: 'SET_SEVERITY_FILTER'; payload: IncidentSeverity | undefined };

const initialState: IncidentState = {
  list: createInitialAsyncState<Incident[]>([]),
  selected: null,
  searchQuery: '',
};

function incidentReducer(state: IncidentState, action: IncidentAction): IncidentState {
  switch (action.type) {
    case 'START_FETCH_LIST':
      return { ...state, list: { ...state.list, loading: true, error: null } };
    case 'FETCH_LIST_SUCCESS':
      return { ...state, list: { data: action.payload, loading: false, error: null } };
    case 'FETCH_LIST_FAILURE':
      return { ...state, list: { data: [], loading: false, error: action.payload } };
    case 'SELECT_INCIDENT':
      return { ...state, selected: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_STATUS_FILTER':
      return { ...state, filterStatus: action.payload };
    case 'SET_SEVERITY_FILTER':
      return { ...state, filterSeverity: action.payload };
    default:
      return state;
  }
}

interface IncidentContextProps extends IncidentState {
  fetchIncidents: (query?: string, status?: IncidentStatus, severity?: IncidentSeverity) => Promise<void>;
  selectIncident: (incident: Incident | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status?: IncidentStatus) => void;
  setSeverityFilter: (severity?: IncidentSeverity) => void;
}

const IncidentContext = createContext<IncidentContextProps | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(incidentReducer, initialState);

  const fetchIncidents = useCallback(async (query?: string, status?: IncidentStatus, severity?: IncidentSeverity) => {
    dispatch({ type: 'START_FETCH_LIST' });
    try {
      const res = await incidentService.filterAndSearchIncidents(query, status, severity);
      dispatch({ type: 'FETCH_LIST_SUCCESS', payload: res });
      if (res.length > 0 && !state.selected) {
        dispatch({ type: 'SELECT_INCIDENT', payload: res[0] });
      }
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_LIST_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, [state.selected]);

  const selectIncident = useCallback((incident: Incident | null) => {
    dispatch({ type: 'SELECT_INCIDENT', payload: incident });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setStatusFilter = useCallback((status?: IncidentStatus) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: status });
  }, []);

  const setSeverityFilter = useCallback((severity?: IncidentSeverity) => {
    dispatch({ type: 'SET_SEVERITY_FILTER', payload: severity });
  }, []);

  return (
    <IncidentContext.Provider
      value={{
        ...state,
        fetchIncidents,
        selectIncident,
        setSearchQuery,
        setStatusFilter,
        setSeverityFilter,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export function useIncidents(): IncidentContextProps {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}
