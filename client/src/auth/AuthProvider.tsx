import * as React from 'react';
import { useReducer, useCallback } from 'react';
import { authReducer } from './reducer';
import { initialState } from './store';
import { fetchWithAuth } from './authFetch';
import {
  SET_LOADING,
  LOGIN,
  LOGOUT,
  SET_COOKIE,
  BASE_URL,
  LOGIN_URL,
  LOGOUT_URL,
  USERINFO_URL,
  IMAGE_URL,
  SET_IMAGES,
  SET_SESSIONS,
  SESSION_URL,
  CONTEXT_URL,
  SET_CONTEXT,
} from './constants';
import { AuthContext } from './authContext';
import { getImagesByProject } from '../utilities/images';
import { getTransformedSessions } from '../utilities/sessions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (username: string, password: string) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetchWithAuth(`${BASE_URL}${LOGIN_URL}`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      dispatch({ type: SET_COOKIE, payload: data });
      const responseUser = await fetchWithAuth(`${BASE_URL}${USERINFO_URL}`, {
        method: 'POST',
        body: JSON.stringify({ cookie: data.cookie }),
      });
      const userData = await responseUser.json();
      dispatch({ type: LOGIN, payload: { username: userData.data.name } });
      const responseContext = await fetchWithAuth(`${BASE_URL}${CONTEXT_URL}`, {
        method: 'POST',
        body: JSON.stringify({ cookie: data.cookie }),
      });
      const contextData = await responseContext.json();
      dispatch({ type: SET_CONTEXT, payload: contextData.data });
      const responseSessions = await fetchWithAuth(
        `${BASE_URL}${SESSION_URL}`,
        {
          method: 'POST',
          body: JSON.stringify({ cookie: data.cookie }),
        },
      );
      const sessionsData = await responseSessions.json();
      const reprocessedSessions = getTransformedSessions(sessionsData.data);
      dispatch({
        type: SET_SESSIONS,
        payload: { sessions: reprocessedSessions },
      });

      const responseImages = await fetchWithAuth(`${BASE_URL}${IMAGE_URL}`, {
        method: 'POST',
        body: JSON.stringify({ cookie: data.cookie }),
      });
      const imagesData = await responseImages.json();
      const imagesByProject = getImagesByProject(imagesData.data);
      dispatch({ type: SET_IMAGES, payload: { images: imagesByProject } });
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message to user)
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      await fetchWithAuth(`${BASE_URL}/${LOGOUT_URL}`, { method: 'POST' });
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
