import {
  ACTIVE,
  AUTHENTICATING,
  AVAILABLE_IMAGES,
  CLEAR_DELETE_SESSION_INFO,
  FETCH_FAILED,
  LOGIN,
  LOGOUT,
  OPERATIONAL,
  OUTAGE,
  RUNNING_SESSION,
  SESSION_STATS,
  SET_CONTEXT,
  SET_COOKIE,
  SET_DELETE_SESSION_INFO,
  SET_IMAGES,
  SET_LOADING,
  SET_SESSIONS,
  SET_SESSIONS_STATS,
} from './constants';
import { AuthAction, AuthState } from './types';

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: {
          username: action.payload.username,
        },
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {
          username: '',
        },
        cookie: '',
        loading: {
          [AUTHENTICATING]: false,
          [SESSION_STATS]: true,
          [AVAILABLE_IMAGES]: true,
          [RUNNING_SESSION]: true,
        },
        services_statuses: {
          [AUTHENTICATING]: {
            status: ACTIVE,
            message: 'Waiting for server response...',
          },
          [SESSION_STATS]: {
            status: ACTIVE,
            message: 'Waiting for user input...',
          },
          [AVAILABLE_IMAGES]: {
            status: ACTIVE,
            message: 'Waiting for user input...',
          },
          [RUNNING_SESSION]: {
            status: ACTIVE,
            message: 'Waiting for user input...',
          },
        },
        usage: null,
        images: {},
        sessions: [],
        context: null,
        deleteSessionInfo: {
          showModal: false,
          sessionId: '',
          sessionName: '',
        },
      };
    case SET_COOKIE:
      return {
        ...state,
        cookie: action.payload,
        isAuthenticated: true,
      };
    case SET_IMAGES:
      return {
        ...state,
        images: action.payload.images,
      };
    case SET_SESSIONS:
      return {
        ...state,
        sessions: action.payload.sessions,
      };
    case SET_CONTEXT:
      return {
        ...state,
        context: action.payload,
      };
    case SET_SESSIONS_STATS:
      return {
        ...state,
        usage: action.payload,
      };
    case CLEAR_DELETE_SESSION_INFO:
      return {
        ...state,
        deleteSessionInfo: {
          showModal: false,
          sessionId: '',
          sessionName: '',
        },
      };
    case SET_DELETE_SESSION_INFO:
      return {
        ...state,
        deleteSessionInfo: {
          showModal: true,
          sessionId: action.payload.sessionId,
          sessionName: action.payload.sessionName,
        },
      };
    case SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.isLoading,
        },
        services_statuses: {
          ...state.services_statuses,
          [action.payload.type]: {
            status: action.payload.isLoading ? ACTIVE : OPERATIONAL,
            message: action.payload.isLoading ? 'Loading...' : '',
          },
        },
      };
    case FETCH_FAILED:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: false,
        },
        services_statuses: {
          ...state.services_statuses,
          [action.payload.type]: {
            status: OUTAGE,
            message: action.payload.message,
          },
        },
      };
    default:
      return state;
  }
};
