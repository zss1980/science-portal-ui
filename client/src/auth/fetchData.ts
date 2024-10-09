import { Dispatch } from 'react';
import {
  AVAILABLE_IMAGES,
  BASE_URL,
  CLEAR_DELETE_SESSION_INFO,
  CONTEXT_URL,
  CREATE_SESSION,
  CREATE_SESSION_URL,
  DELETE_SESSION,
  DELETE_SESSION_URL,
  DESKTOP,
  FETCH_FAILED,
  IMAGE_URL,
  LOGIN,
  PROP_SESSION_CORES,
  PROP_SESSION_IMAGE,
  PROP_SESSION_NAME,
  PROP_SESSION_RAM,
  PROP_SESSION_TYPE,
  RUNNING_SESSION,
  SESSION_STATS,
  SESSION_URL,
  SESSION_VIEW_URL,
  SET_CONTEXT,
  SET_IMAGES,
  SET_LOADING,
  SET_SESSIONS,
  SET_SESSIONS_STATS,
  USERINFO_URL,
} from './constants';
import { AuthAction, NewSession } from './types';
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

export const fetchDeleteSession = (
  cookie: string,
  dispatch: Dispatch<AuthAction>,
  sessionId: string,
) => {
  const fetchOptions = {
    method: 'DELETE',
    body: JSON.stringify({ cookie, sessionId }),
  };
  dispatch({ type: CLEAR_DELETE_SESSION_INFO });
  dispatch({
    type: SET_LOADING,
    payload: { type: DELETE_SESSION, isLoading: true },
  });

  fetchWithAuth(`${BASE_URL}${DELETE_SESSION_URL}`, fetchOptions)
    .then((response) => response.json())
    .then(() => {
      fetchRunningSessions(cookie, dispatch);
      dispatch({
        type: SET_LOADING,
        payload: { type: DELETE_SESSION, isLoading: false },
      });
    })
    .catch((e) => {
      dispatch({
        type: FETCH_FAILED,
        payload: { type: DELETE_SESSION, message: e.message },
      });
    });
};

export const fetchCreateSession = (
  cookie: string,
  dispatch: Dispatch<AuthAction>,
  sessionPayload: NewSession,
) => {
  const submitPayload: NewSession = {
    sessionName: sessionPayload[PROP_SESSION_NAME],
    sessionType: sessionPayload[PROP_SESSION_TYPE],
    sessionImage: sessionPayload[PROP_SESSION_IMAGE],
  };
  if (sessionPayload[PROP_SESSION_TYPE] !== DESKTOP) {
    submitPayload[PROP_SESSION_CORES] = sessionPayload[PROP_SESSION_CORES];
    submitPayload[PROP_SESSION_RAM] = sessionPayload[PROP_SESSION_RAM];
  }

  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({
      cookie,
      ...submitPayload,
    }),
  };

  dispatch({
    type: SET_LOADING,
    payload: { type: CREATE_SESSION, isLoading: true },
  });

  fetchWithAuth(`${BASE_URL}${CREATE_SESSION_URL}`, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      fetchRunningSessions(cookie, dispatch);
      dispatch({
        type: SET_LOADING,
        payload: { type: CREATE_SESSION, isLoading: false },
      });
    })
    .catch((e) => {
      dispatch({
        type: FETCH_FAILED,
        payload: { type: CREATE_SESSION, message: e.message },
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
