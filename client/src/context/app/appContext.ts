import React from 'react';
import { createContext } from 'react';

import { AppState, AppFetch, FetchResult } from './types';

export const AppContext = createContext<
  | {
      state: AppState;
      appFetch: (args: AppFetch) => Promise<FetchResult>;
    }
  | undefined
>(undefined);
