import * as React from 'react';
import { useReducer, useCallback } from 'react';
import { authReducer } from './reducer';
import { initialState } from './store';
import { fetchWithAuth } from './authFetch';
import {
  SET_LOADING,
  LOGOUT,
  SET_COOKIE,
  BASE_URL,
  LOGIN_URL,
  LOGOUT_URL,
  AUTHENTICATING,
  FETCH_FAILED,
} from './constants';
import { AuthContext } from './authContext';
import fetchDataConcurrently from './fetchData';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (username: string, password: string) => {
    dispatch({
      type: SET_LOADING,
      payload: { isLoading: true, type: AUTHENTICATING },
    });
    try {
      const response = await fetchWithAuth(`${BASE_URL}${LOGIN_URL}`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      dispatch({ type: SET_COOKIE, payload: data });
      fetchDataConcurrently(data.cookie, dispatch);
    } catch (e) {
      console.error('Login failed:', e);
      dispatch({
        type: FETCH_FAILED,
        payload: { type: AUTHENTICATING, message: e.message },
      });
      // Handle login error (e.g., show error message to user)
    } finally {
      dispatch({
        type: SET_LOADING,
        payload: { isLoading: false, type: AUTHENTICATING },
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchWithAuth(`${BASE_URL}/${LOGOUT_URL}`, { method: 'POST' });
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
