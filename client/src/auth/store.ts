import { AuthState } from './types';
import {
  AVAILABLE_IMAGES,
  OPERATIONAL,
  RUNNING_SESSION,
  SESSION_STATS,
} from './constants';

// Initial state
export const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    username: '',
  },
  cookie: '',
  loading: {
    [SESSION_STATS]: false,
    [AVAILABLE_IMAGES]: false,
    [RUNNING_SESSION]: false,
  },
  services_statuses: {
    [SESSION_STATS]: {
      status: OPERATIONAL,
      message: '',
    },
    [AVAILABLE_IMAGES]: {
      status: OPERATIONAL,
      message: '',
    },
    [RUNNING_SESSION]: {
      status: OPERATIONAL,
      message: '',
    },
  },
  usage: null,
  images: {},
  sessions: [],
  context: null,
};
