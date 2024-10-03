import {
  LOGIN,
  LOGOUT,
  SET_COOKIE,
  SET_IMAGES,
  SET_LOADING,
  SET_SESSIONS,
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
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
