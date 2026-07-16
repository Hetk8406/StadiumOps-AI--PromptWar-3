import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { Volunteer } from '../../domain/models';
import { VolunteerRole, VolunteerStatus } from '../../domain/enums';
import { volunteerService } from '../../services';

interface VolunteerState {
  list: AsyncState<Volunteer[]>;
  selected: Volunteer | null;
  searchQuery: string;
  filterRole?: VolunteerRole;
  filterStatus?: VolunteerStatus;
}

type VolunteerAction =
  | { type: 'START_FETCH_LIST' }
  | { type: 'FETCH_LIST_SUCCESS'; payload: Volunteer[] }
  | { type: 'FETCH_LIST_FAILURE'; payload: string }
  | { type: 'SELECT_VOLUNTEER'; payload: Volunteer | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_ROLE_FILTER'; payload: VolunteerRole | undefined }
  | { type: 'SET_STATUS_FILTER'; payload: VolunteerStatus | undefined };

const initialState: VolunteerState = {
  list: createInitialAsyncState<Volunteer[]>([]),
  selected: null,
  searchQuery: '',
};

function volunteerReducer(state: VolunteerState, action: VolunteerAction): VolunteerState {
  switch (action.type) {
    case 'START_FETCH_LIST':
      return { ...state, list: { ...state.list, loading: true, error: null } };
    case 'FETCH_LIST_SUCCESS':
      return { ...state, list: { data: action.payload, loading: false, error: null } };
    case 'FETCH_LIST_FAILURE':
      return { ...state, list: { data: [], loading: false, error: action.payload } };
    case 'SELECT_VOLUNTEER':
      return { ...state, selected: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_ROLE_FILTER':
      return { ...state, filterRole: action.payload };
    case 'SET_STATUS_FILTER':
      return { ...state, filterStatus: action.payload };
    default:
      return state;
  }
}

interface VolunteerContextProps extends VolunteerState {
  fetchVolunteers: (query?: string, role?: VolunteerRole, status?: VolunteerStatus) => Promise<void>;
  selectVolunteer: (v: Volunteer | null) => void;
  setSearchQuery: (query: string) => void;
  setRoleFilter: (role?: VolunteerRole) => void;
  setStatusFilter: (status?: VolunteerStatus) => void;
}

const VolunteerContext = createContext<VolunteerContextProps | undefined>(undefined);

export const VolunteerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(volunteerReducer, initialState);

  const fetchVolunteers = useCallback(async (query?: string, role?: VolunteerRole, status?: VolunteerStatus) => {
    dispatch({ type: 'START_FETCH_LIST' });
    try {
      const res = await volunteerService.filterAndSearchVolunteers(query, role, status);
      dispatch({ type: 'FETCH_LIST_SUCCESS', payload: res });
      if (res.length > 0 && !state.selected) {
        dispatch({ type: 'SELECT_VOLUNTEER', payload: res[0] });
      }
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_LIST_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, [state.selected]);

  const selectVolunteer = useCallback((v: Volunteer | null) => {
    dispatch({ type: 'SELECT_VOLUNTEER', payload: v });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setRoleFilter = useCallback((role?: VolunteerRole) => {
    dispatch({ type: 'SET_ROLE_FILTER', payload: role });
  }, []);

  const setStatusFilter = useCallback((status?: VolunteerStatus) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: status });
  }, []);

  return (
    <VolunteerContext.Provider
      value={{
        ...state,
        fetchVolunteers,
        selectVolunteer,
        setSearchQuery,
        setRoleFilter,
        setStatusFilter,
      }}
    >
      {children}
    </VolunteerContext.Provider>
  );
};

export function useVolunteers(): VolunteerContextProps {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error('useVolunteers must be used within a VolunteerProvider');
  }
  return context;
}
