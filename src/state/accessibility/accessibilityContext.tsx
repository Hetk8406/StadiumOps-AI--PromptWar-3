import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { AccessibilityRequest } from '../../domain/models';
import { AccessibilityCategory, AccessibilityRequestStatus } from '../../domain/enums';
import { accessibilityService } from '../../services';

interface AccessibilityState {
  requests: AsyncState<AccessibilityRequest[]>;
  selectedRequest: AccessibilityRequest | null;
  searchQuery: string;
  filterCategory?: AccessibilityCategory;
  filterStatus?: AccessibilityRequestStatus;
}

type AccessibilityAction =
  | { type: 'START_FETCH_REQUESTS' }
  | { type: 'FETCH_REQUESTS_SUCCESS'; payload: AccessibilityRequest[] }
  | { type: 'FETCH_REQUESTS_FAILURE'; payload: string }
  | { type: 'SELECT_REQUEST'; payload: AccessibilityRequest | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: AccessibilityCategory | undefined }
  | { type: 'SET_STATUS_FILTER'; payload: AccessibilityRequestStatus | undefined };

const initialState: AccessibilityState = {
  requests: createInitialAsyncState<AccessibilityRequest[]>([]),
  selectedRequest: null,
  searchQuery: '',
};

function accessibilityReducer(state: AccessibilityState, action: AccessibilityAction): AccessibilityState {
  switch (action.type) {
    case 'START_FETCH_REQUESTS':
      return { ...state, requests: { ...state.requests, loading: true, error: null } };
    case 'FETCH_REQUESTS_SUCCESS':
      return { ...state, requests: { data: action.payload, loading: false, error: null } };
    case 'FETCH_REQUESTS_FAILURE':
      return { ...state, requests: { data: [], loading: false, error: action.payload } };
    case 'SELECT_REQUEST':
      return { ...state, selectedRequest: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_CATEGORY_FILTER':
      return { ...state, filterCategory: action.payload };
    case 'SET_STATUS_FILTER':
      return { ...state, filterStatus: action.payload };
    default:
      return state;
  }
}

interface AccessibilityContextProps extends AccessibilityState {
  fetchRequests: (query?: string, category?: AccessibilityCategory, status?: AccessibilityRequestStatus) => Promise<void>;
  selectRequest: (req: AccessibilityRequest | null) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category?: AccessibilityCategory) => void;
  setStatusFilter: (status?: AccessibilityRequestStatus) => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState);

  const fetchRequests = useCallback(async (query?: string, category?: AccessibilityCategory, status?: AccessibilityRequestStatus) => {
    dispatch({ type: 'START_FETCH_REQUESTS' });
    try {
      const res = await accessibilityService.filterRequests(query, category, status);
      dispatch({ type: 'FETCH_REQUESTS_SUCCESS', payload: res });
      if (res.length > 0 && !state.selectedRequest) {
        dispatch({ type: 'SELECT_REQUEST', payload: res[0] });
      }
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_REQUESTS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, [state.selectedRequest]);

  const selectRequest = useCallback((req: AccessibilityRequest | null) => {
    dispatch({ type: 'SELECT_REQUEST', payload: req });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setCategoryFilter = useCallback((category?: AccessibilityCategory) => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: category });
  }, []);

  const setStatusFilter = useCallback((status?: AccessibilityRequestStatus) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: status });
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        fetchRequests,
        selectRequest,
        setSearchQuery,
        setCategoryFilter,
        setStatusFilter,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility(): AccessibilityContextProps {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
