import { createContext } from 'react';

import { AuthState, AuthAction } from './types';

export const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: React.Dispatch<AuthAction>;
      login: (username: string, password: string) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
