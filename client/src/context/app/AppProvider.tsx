// Libs
import * as React from 'react';
import { Dispatch, useCallback, useReducer } from 'react';

// Constants
import {
  APP_ACTION_MESSAGE,
  APP_ACTION_TYPE,
  APP_FETCH_OPTIONS,
  APP_FETCH_URL,
  APP_IS_LOADING,
  APP_PART_TYPE,
  FETCH_FAILED,
  SET_LOADING,
} from './constants';

// Reducer
import { appReducer } from './reducer';

// Store
import { initialState } from './store';

// Types
import { AppAction, AppFetch } from './types';

// Utils
import { fetchWithAuth } from './authFetch';

// Context
import { AppContext } from './appContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchFn = useCallback(
    (dispatch: Dispatch<AppAction>) => async (payload: AppFetch) => {
      dispatch({
        type: SET_LOADING,
        payload: {
          [APP_IS_LOADING]: true,
          [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
        },
      });
      try {
        const response = await fetchWithAuth(
          payload[APP_FETCH_URL],
          payload[APP_FETCH_OPTIONS],
        );
        return await response.json();
      } catch (e: unknown) {
        console.error('Fetch failed:', e);
        dispatch({
          type: FETCH_FAILED,
          payload: {
            [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
            [APP_ACTION_MESSAGE]: (e as Error).message,
          },
        });
        throw e;
      } finally {
        dispatch({
          type: SET_LOADING,
          payload: {
            [APP_IS_LOADING]: false,
            [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
          },
        });
      }
    },
    [],
  );
  const appFetch = fetchFn(dispatch);
  return (
    <AppContext.Provider value={{ state, appFetch }}>
      {children}
    </AppContext.Provider>
  );
};
