import {
  LOGIN,
  LOGOUT,
  SET_CONTEXT,
  SET_COOKIE,
  SET_IMAGES,
  SET_LOADING,
  SET_SESSIONS,
  SET_SESSIONS_STATS,
} from './constants';
import { AuthState, AuthAction } from './types';

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: {
          username: action.payload.username,
        },
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {
          username: '',
        },
        cookie: '',
        loading: false,
      };
    case SET_COOKIE:
      return {
        ...state,
        cookie: action.payload,
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
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
