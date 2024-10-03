import { AuthState } from './types';

// Initial state
export const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    username: '',
  },
  cookie: '',
  loading: false,
  images: {},
  sessions: [],
};
