import { AuthState } from './types';
import {
  AUTHENTICATING,
  AVAILABLE_IMAGES,
  CREATE_SESSION,
  DELETE_SESSION,
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
    [AUTHENTICATING]: false,
    [SESSION_STATS]: false,
    [AVAILABLE_IMAGES]: false,
    [RUNNING_SESSION]: false,
    [DELETE_SESSION]: false,
    [CREATE_SESSION]: false,
  },
  services_statuses: {
    [AUTHENTICATING]: {
      status: OPERATIONAL,
      message: '',
    },
    [DELETE_SESSION]: {
      status: OPERATIONAL,
      message: '',
    },
    [CREATE_SESSION]: {
      status: OPERATIONAL,
      message: '',
    },
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
  deleteSessionInfo: {
    showModal: false,
    sessionId: '',
    sessionName: '',
  },
};
