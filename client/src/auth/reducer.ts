import {
  ACTIVE,
  AUTHENTICATING,
  AVAILABLE_IMAGES,
  CLEAR_DELETE_SESSION_INFO,
  CREATE_SESSION,
  DELETE_SESSION,
  FETCH_FAILED,
  FETCHING_SESSION,
  LOGIN,
  LOGOUT,
  OPERATIONAL,
  OUTAGE,
  RENEW_SESSION,
  RUNNING_SESSIONS,
  SESSION_STATS,
  SET_CONTEXT,
  SET_COOKIE,
  SET_DELETE_SESSION_INFO,
  SET_IMAGES,
  SET_LOADING,
  SET_SESSION,
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
          [RUNNING_SESSIONS]: true,
          [CREATE_SESSION]: false,
          [DELETE_SESSION]: false,
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
          [CREATE_SESSION]: {
            status: ACTIVE,
            message: 'Waiting for user input...',
          },
          [FETCHING_SESSION]: {
            status: ACTIVE,
            message: 'Waiting for user input...',
          },
          [RENEW_SESSION]: {
            status: ACTIVE,
            message: 'Waiting for user input...',
          },
          [DELETE_SESSION]: {
            status: ACTIVE,
            message: 'Waiting for user input...',
          },
          [RUNNING_SESSIONS]: {
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
    case SET_SESSION:
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.payload.session.id]: action.payload.session,
        },
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
