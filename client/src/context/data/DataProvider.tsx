import * as React from 'react';
import { useReducer, useCallback } from 'react';

import {
  AVAILABLE_IMAGES,
  BASE_URL,
  CLEAR_DATA,
  CONTEXT_URL,
  CREATE_SESSION,
  CREATE_SESSION_URL,
  DELETE_SESSION,
  DELETE_SESSION_URL,
  DESKTOP,
  FETCH_SESSION_URL,
  FETCHING_SESSION,
  IMAGE_URL,
  PLATFORM_CONTEXT,
  PROP_SESSION_CORES,
  PROP_SESSION_IMAGE,
  PROP_SESSION_NAME,
  PROP_SESSION_RAM,
  PROP_SESSION_TYPE,
  RENEW_SESSION,
  RENEW_SESSION_URL,
  SESSION_URL,
  SESSION_VIEW_URL,
  SET_CONTEXT,
  SET_IMAGES,
  SET_SESSION,
  SET_SESSIONS,
  SET_SESSIONS_STATS,
} from './constants';
import { DataContext } from './dataContext';
import {
  APP_FETCH_OPTIONS,
  APP_FETCH_RESULT,
  APP_FETCH_URL,
  APP_PART_TYPE,
  RUNNING_SESSIONS,
  SESSION_STATS,
} from '../app/constants';
import { initialState } from './store';
import { dataReducer } from './reducer';
import { useApp } from '../app/useApp';
import { useAuth } from '../auth/useAuth';
import processPlatformUsage from '../../utilities/usage';
import {
  getTransformedSessions,
  transformSession,
} from '../../utilities/sessions';
import { Context, Image, NewSession, Session, StatsData } from './types';
import { getImagesByType } from '../../utilities/images';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { appFetch } = useApp();
  const { state: authState } = useAuth();
  const fetchStatsData = useCallback(async () => {
    try {
      const responseData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${SESSION_VIEW_URL}`,
        [APP_FETCH_OPTIONS]: {
          method: 'POST',
          body: JSON.stringify({ cookie: authState.cookie }),
        },
        [APP_PART_TYPE]: SESSION_STATS,
      });
      const rawStatsData = responseData[APP_FETCH_RESULT].data as unknown;
      const reprocessedStatsData = processPlatformUsage(
        rawStatsData as StatsData,
      );
      dispatch({ type: SET_SESSIONS_STATS, payload: reprocessedStatsData });
    } catch (e) {
      console.error('Fetch data stats failed:', e);
    }
  }, [appFetch, authState]);

  const fetchRunningSessions = useCallback(async () => {
    try {
      const sessionsData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${SESSION_URL}`,
        [APP_FETCH_OPTIONS]: {
          method: 'POST',
          body: JSON.stringify({ cookie: authState.cookie }),
        },
        [APP_PART_TYPE]: RUNNING_SESSIONS,
      });
      const rawSessions = sessionsData[APP_FETCH_RESULT].data as unknown;
      const reprocessedSessions = getTransformedSessions(
        rawSessions as Session[],
      );
      dispatch({
        type: SET_SESSIONS,
        payload: { sessions: reprocessedSessions },
      });
    } catch (e) {
      console.error('Fetch sessions failed:', e);
    }
  }, [appFetch, authState]);

  const fetchDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${DELETE_SESSION_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'DELETE',
            body: JSON.stringify({ cookie: authState.cookie, sessionId }),
          },
          [APP_PART_TYPE]: DELETE_SESSION,
        });
        fetchRunningSessions();
      } catch (e) {
        console.error('Fetch delete sessions failed:', e);
      }
    },
    [appFetch, authState, fetchRunningSessions],
  );

  const fetchRenewSession = useCallback(
    async (sessionId: string) => {
      try {
        const renewSession = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${RENEW_SESSION_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            body: JSON.stringify({ cookie: authState.cookie, sessionId }),
          },
          [APP_PART_TYPE]: RENEW_SESSION,
        });
        if (renewSession) {
          fetchRunningSessions();
        }
      } catch (e) {
        console.error('Fetch renew sessions failed:', e);
      }
    },
    [appFetch, authState, fetchRunningSessions],
  );

  const fetchSessionStatus = useCallback(
    async (sessionId: string) => {
      try {
        const sessionData = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${FETCH_SESSION_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            body: JSON.stringify({ cookie: authState.cookie, sessionId }),
          },
          [APP_PART_TYPE]: FETCHING_SESSION,
        });
        const rawSession = sessionData[APP_FETCH_RESULT].data as unknown;
        const reprocessedSession = transformSession(rawSession as Session);
        dispatch({
          type: SET_SESSION,
          payload: { session: reprocessedSession },
        });
      } catch (e) {
        console.error('Fetch session status failed:', e);
      }
    },
    [appFetch, authState],
  );

  const fetchPlatformContext = useCallback(async () => {
    try {
      const contextData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${CONTEXT_URL}`,
        [APP_FETCH_OPTIONS]: {
          method: 'POST',
          body: JSON.stringify({ cookie: authState.cookie }),
        },
        [APP_PART_TYPE]: PLATFORM_CONTEXT,
      });
      const rawContext = contextData[APP_FETCH_RESULT].data as unknown;
      dispatch({
        type: SET_CONTEXT,
        payload: rawContext as Context,
      });
    } catch (e) {
      console.error('Fetch context failed:', e);
    }
  }, [appFetch, authState]);

  const fetchPlatformImages = useCallback(async () => {
    try {
      const imagesData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${IMAGE_URL}`,
        [APP_FETCH_OPTIONS]: {
          method: 'POST',
          body: JSON.stringify({ cookie: authState.cookie }),
        },
        [APP_PART_TYPE]: AVAILABLE_IMAGES,
      });
      const rawImages = imagesData[APP_FETCH_RESULT].data as unknown;
      const imagesByType = getImagesByType(rawImages as Image[]);

      dispatch({
        type: SET_IMAGES,
        payload: { images: imagesByType },
      });
    } catch (e) {
      console.error('Fetch images failed:', e);
    }
  }, [appFetch, authState]);

  const fetchCreateSession = useCallback(
    async (sessionPayload: NewSession) => {
      const submitPayload: NewSession = {
        sessionName: sessionPayload[PROP_SESSION_NAME],
        sessionType: sessionPayload[PROP_SESSION_TYPE],
        sessionImage: sessionPayload[PROP_SESSION_IMAGE],
      };
      if (sessionPayload[PROP_SESSION_TYPE] !== DESKTOP) {
        submitPayload[PROP_SESSION_CORES] = sessionPayload[PROP_SESSION_CORES];
        submitPayload[PROP_SESSION_RAM] = sessionPayload[PROP_SESSION_RAM];
      }

      try {
        const sessionData = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${CREATE_SESSION_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            body: JSON.stringify({
              cookie: authState.cookie,
              ...submitPayload,
            }),
          },
          [APP_PART_TYPE]: CREATE_SESSION,
        });
        if (sessionData) {
          fetchRunningSessions();
        }
      } catch (e) {
        console.error('Fetch create session failed:', e);
      }
    },
    [appFetch, authState, fetchRunningSessions],
  );

  const clearData = useCallback(async () => {
    dispatch({
      type: CLEAR_DATA,
    });
  }, [dispatch]);

  return (
    <DataContext.Provider
      value={{
        state,
        fetchRunningSessions,
        fetchCreateSession,
        fetchDeleteSession,
        fetchRenewSession,
        fetchSessionStatus,
        fetchStatsData,
        fetchPlatformContext,
        fetchPlatformImages,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
