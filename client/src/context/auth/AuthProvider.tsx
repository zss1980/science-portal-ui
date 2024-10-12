import * as React from 'react';
import { useReducer, useCallback } from 'react';
import { authReducer } from './reducer';
import { initialState } from './store';
import { fetchWithAuth } from './authFetch';
import {
  LOGOUT,
  SET_COOKIE,
  BASE_URL,
  LOGIN_URL,
  LOGOUT_URL,
} from './constants';
import { AuthContext } from './authContext';
import fetchDataConcurrently from './fetchData';
import { useApp } from '../app/useApp';
import {
  APP_FETCH_OPTIONS,
  APP_FETCH_URL,
  APP_PART_TYPE,
  AUTHENTICATING,
} from '../app/constants';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { appFetch } = useApp();
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const responseData = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${LOGIN_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          },
          [APP_PART_TYPE]: AUTHENTICATING,
        });
        dispatch({ type: SET_COOKIE, payload: responseData.cookie });
        //fetchDataConcurrently(data.cookie, dispatch);
      } catch (e) {
        console.error('Login failed:', e);
        // Handle login error (e.g., show error message to user)
      }
    },
    [appFetch],
  );

  const logout = useCallback(async () => {
    try {
      await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${LOGOUT_URL}`,
        [APP_FETCH_OPTIONS]: {
          method: 'POST',
        },
        [APP_PART_TYPE]: AUTHENTICATING,
      });
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error
    }
  }, [appFetch]);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
