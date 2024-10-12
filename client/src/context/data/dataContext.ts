// Libs
import React from 'react';
import { createContext } from 'react';

// Types
import { DataState, DataAction } from './types';

export const DataContext = createContext<
  | {
      state: DataState;
      dispatch: React.Dispatch<DataAction>;
    }
  | undefined
>(undefined);
