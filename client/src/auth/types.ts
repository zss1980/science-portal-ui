import {
  CARTA,
  DESKTOP_APP,
  HEADLESS,
  LOGIN,
  LOGOUT,
  NOTEBOOK,
  SET_COOKIE,
  SET_IMAGES,
  SET_LOADING,
  SET_SESSIONS,
  PROP_ID,
  PROP_USERID,
  PROP_RUN_AS_UID,
  PROP_RUN_AS_GID,
  PROP_SUPPLEMENTAL_GROUPS,
  PROP_APPID,
  PROP_IMAGE,
  PROP_TYPE,
  PROP_STATUS,
  PROP_NAME,
  PROP_START_TIME,
  PROP_EXPIRY_TIME,
  PROP_CONNECT_URL,
  PROP_REQUESTED_RAM,
  PROP_REQUESTED_CPU_CORES,
  PROP_REQUESTED_GPU_CORES,
  PROP_RAM_IN_USE,
  PROP_GPU_RAM_IN_USE,
  PROP_CPU_CORES_IN_USE,
  PROP_GPU_UTILIZATION,
  DESKTOP,
  CONTRIBUTED,
} from './constants';

// State interface
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
  };
  cookie: string;
  loading: boolean;
  images: { [key: string]: { [key: string]: Image[] } };
  sessions: Session[];
}

export type ImageType =
  | typeof HEADLESS
  | typeof DESKTOP_APP
  | typeof CARTA
  | typeof NOTEBOOK
  | typeof DESKTOP
  | typeof CONTRIBUTED;

export interface Image {
  id: string;
  digest: string;
  types: ImageType[];
}

export interface Session {
  [PROP_ID]: string;
  [PROP_USERID]: string;
  [PROP_RUN_AS_UID]: string;
  [PROP_RUN_AS_GID]: string;
  [PROP_SUPPLEMENTAL_GROUPS]: number[];
  [PROP_APPID]: string;
  [PROP_IMAGE]: string;
  [PROP_TYPE]: ImageType;
  [PROP_STATUS]: string;
  [PROP_NAME]: string;
  [PROP_START_TIME]: string;
  [PROP_EXPIRY_TIME]: string;
  [PROP_CONNECT_URL]: string;
  [PROP_REQUESTED_RAM]: string;
  [PROP_REQUESTED_CPU_CORES]: string;
  [PROP_REQUESTED_GPU_CORES]: string;
  [PROP_RAM_IN_USE]: string;
  [PROP_GPU_RAM_IN_USE]: string;
  [PROP_CPU_CORES_IN_USE]: string;
  [PROP_GPU_UTILIZATION]: string;
}

// Action types
export type AuthAction =
  | { type: typeof LOGIN; payload: { username: string } }
  | { type: typeof LOGOUT }
  | { type: typeof SET_COOKIE; payload: string }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_SESSIONS; payload: { sessions: Session[] } }
  | {
      type: typeof SET_IMAGES;
      payload: { images: { [key: string]: { [key: string]: Image[] } } };
    };
