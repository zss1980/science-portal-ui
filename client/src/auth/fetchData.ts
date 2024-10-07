import { Dispatch } from 'react';
import {
  LOGIN,
  SET_CONTEXT,
  SET_SESSIONS_STATS,
  SET_SESSIONS,
  SET_IMAGES,
  BASE_URL,
  USERINFO_URL,
  CONTEXT_URL,
  SESSION_VIEW_URL,
  SESSION_URL,
  IMAGE_URL,
  SET_LOADING,
  SESSION_STATS,
  RUNNING_SESSION,
  AVAILABLE_IMAGES,
  FETCH_FAILED,
} from './constants';
import { AuthAction } from './types';
import { fetchWithAuth } from './authFetch';
import processPlatformUsage from '../utilities/usage';
import { getTransformedSessions } from '../utilities/sessions';
import { getImagesByType } from '../utilities/images';

const fetchDataConcurrently = (
  cookie: string,
  dispatch: Dispatch<AuthAction>,
) => {
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({ cookie }),
  };

  // User Info
  fetchWithAuth(`${BASE_URL}${USERINFO_URL}`, fetchOptions)
    .then((response) => response.json())
    .then((userData) => {
      dispatch({ type: LOGIN, payload: { username: userData.data.name } });
    });

  // Stats
  fetchStatsData(cookie, dispatch);

  // Sessions
  fetchRunningSessions(cookie, dispatch);

  // Images
  fetchImages(cookie, dispatch);
};

export const fetchStatsData = (
  cookie: string,
  dispatch: Dispatch<AuthAction>,
) => {
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({ cookie }),
  };
  dispatch({
    type: SET_LOADING,
    payload: { type: SESSION_STATS, isLoading: true },
  });

  fetchWithAuth(`${BASE_URL}${SESSION_VIEW_URL}`, fetchOptions)
    .then((response) => response.json())
    .then((statsData) => {
      const reprocessedStatsData = processPlatformUsage(statsData.data);
      dispatch({ type: SET_SESSIONS_STATS, payload: reprocessedStatsData });
      dispatch({
        type: SET_LOADING,
        payload: { type: SESSION_STATS, isLoading: false },
      });
    })
    .catch((e) => {
      dispatch({
        type: FETCH_FAILED,
        payload: { type: SESSION_STATS, message: e.message },
      });
    });
};

export const fetchRunningSessions = (
  cookie: string,
  dispatch: Dispatch<AuthAction>,
) => {
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({ cookie }),
  };
  dispatch({
    type: SET_LOADING,
    payload: { type: RUNNING_SESSION, isLoading: true },
  });

  fetchWithAuth(`${BASE_URL}${SESSION_URL}`, fetchOptions)
    .then((response) => response.json())
    .then((sessionsData) => {
      const reprocessedSessions = getTransformedSessions(sessionsData.data);
      dispatch({
        type: SET_SESSIONS,
        payload: { sessions: reprocessedSessions },
      });
      dispatch({
        type: SET_LOADING,
        payload: { type: RUNNING_SESSION, isLoading: false },
      });
    })
    .catch((e) => {
      dispatch({
        type: FETCH_FAILED,
        payload: { type: RUNNING_SESSION, message: e.message },
      });
    });
};

export const fetchImages = (cookie: string, dispatch: Dispatch<AuthAction>) => {
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({ cookie }),
  };
  dispatch({
    type: SET_LOADING,
    payload: { type: AVAILABLE_IMAGES, isLoading: true },
  });

  // Context
  fetchWithAuth(`${BASE_URL}${CONTEXT_URL}`, fetchOptions)
    .then((response) => response.json())
    .then((contextData) => {
      dispatch({ type: SET_CONTEXT, payload: contextData.data });
    });

  fetchWithAuth(`${BASE_URL}${IMAGE_URL}`, fetchOptions)
    .then((response) => response.json())
    .then((imagesData) => {
      const imagesByProject = getImagesByType(imagesData.data);
      dispatch({ type: SET_IMAGES, payload: { images: imagesByProject } });
      dispatch({
        type: SET_LOADING,
        payload: { type: AVAILABLE_IMAGES, isLoading: false },
      });
    })
    .catch((e) => {
      dispatch({
        type: FETCH_FAILED,
        payload: { type: AVAILABLE_IMAGES, message: e.message },
      });
    });
};

export default fetchDataConcurrently;
