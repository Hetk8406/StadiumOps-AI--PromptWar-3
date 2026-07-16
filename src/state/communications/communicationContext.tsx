import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { Broadcast } from '../../domain/models';
import { BroadcastPriority } from '../../domain/enums';
import { communicationService } from '../../services';

interface CommunicationState {
  broadcasts: AsyncState<Broadcast[]>;
  searchQuery: string;
  filterPriority?: BroadcastPriority;
}

type CommunicationAction =
  | { type: 'START_FETCH_BROADCASTS' }
  | { type: 'FETCH_BROADCASTS_SUCCESS'; payload: Broadcast[] }
  | { type: 'FETCH_BROADCASTS_FAILURE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_PRIORITY_FILTER'; payload: BroadcastPriority | undefined };

const initialState: CommunicationState = {
  broadcasts: createInitialAsyncState<Broadcast[]>([]),
  searchQuery: '',
};

function commsReducer(state: CommunicationState, action: CommunicationAction): CommunicationState {
  switch (action.type) {
    case 'START_FETCH_BROADCASTS':
      return { ...state, broadcasts: { ...state.broadcasts, loading: true, error: null } };
    case 'FETCH_BROADCASTS_SUCCESS':
      return { ...state, broadcasts: { data: action.payload, loading: false, error: null } };
    case 'FETCH_BROADCASTS_FAILURE':
      return { ...state, broadcasts: { data: [], loading: false, error: action.payload } };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_PRIORITY_FILTER':
      return { ...state, filterPriority: action.payload };
    default:
      return state;
  }
}

interface CommunicationContextProps extends CommunicationState {
  fetchBroadcasts: (query?: string, priority?: BroadcastPriority) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority?: BroadcastPriority) => void;
}

const CommunicationContext = createContext<CommunicationContextProps | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(commsReducer, initialState);

  const fetchBroadcasts = useCallback(async (query?: string, priority?: BroadcastPriority) => {
    dispatch({ type: 'START_FETCH_BROADCASTS' });
    try {
      const res = await communicationService.filterAndSearchBroadcasts(query, priority);
      dispatch({ type: 'FETCH_BROADCASTS_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_BROADCASTS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setPriorityFilter = useCallback((priority?: BroadcastPriority) => {
    dispatch({ type: 'SET_PRIORITY_FILTER', payload: priority });
  }, []);

  return (
    <CommunicationContext.Provider value={{ ...state, fetchBroadcasts, setSearchQuery, setPriorityFilter }}>
      {children}
    </CommunicationContext.Provider>
  );
};

export function useCommunications(): CommunicationContextProps {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error('useCommunications must be used within a CommunicationProvider');
  }
  return context;
}
