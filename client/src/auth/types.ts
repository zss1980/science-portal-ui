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
  SET_CONTEXT,
  PROP_DEFAULT_REQUEST_CORES,
  PROP_DEFAULT_LIMIT_CORES,
  PROP_DEFAULT_CORES,
  PROP_DEFAULT_CORES_HEADLESS,
  PROP_AVAILABLE_CORES,
  PROP_DEFAULT_REQUEST_RAM,
  PROP_DEFAULT_LIMIT_RAM,
  PROP_DEFAULT_RAM,
  PROP_DEFAULT_RAM_HEADLESS,
  PROP_AVAILABLE_RAM,
  PROP_AVAILABLE_GPUS,
  VAL_PROJECT,
  VAL_TYPE,
  VAL_IMAGE,
  VAL_INSTANCE_NAME,
  VAL_MEMORY,
  VAL_CORES,
  VAL_GPU,
  PROP_STATS_SESSION,
  PROP_STATS_DESKTOP_APP,
  PROP_STATS_HEADLESS,
  PROP_STATS_TOTAL,
  PROP_STATS_REQUESTED_CPU_CORES,
  PROP_STATS_CPU_CORES_AVAILABLE,
  PROP_STATS_MAX_CPU_CORES,
  PROP_STATS_CPU_CORES,
  PROP_STATS_WITH_RAM,
  PROP_STATS_REQUESTED_RAM,
  PROP_STATS_RAM_AVAILABLE,
  PROP_STATS_MAX_RAM,
  PROP_STATS_RAM,
  PROP_STATS_WITH_CPU_CORES,
  PROP_STATS_CORES,
  PROP_STATS_INSTANCES,
  SET_SESSIONS_STATS,
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
  context: Context | null;
  usage: StatsData | null;
}

export interface FormValues {
  [VAL_PROJECT]: string;
  [VAL_TYPE]: string;
  [VAL_IMAGE]: string;
  [VAL_INSTANCE_NAME]: string;
  [VAL_MEMORY]: number;
  [VAL_CORES]: number;
  [VAL_GPU]: number;
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

export interface Context {
  [PROP_DEFAULT_REQUEST_CORES]: number;
  [PROP_DEFAULT_LIMIT_CORES]: number;
  [PROP_DEFAULT_CORES]: number;
  [PROP_DEFAULT_CORES_HEADLESS]: number;
  [PROP_AVAILABLE_CORES]: number[];
  [PROP_DEFAULT_REQUEST_RAM]: number;
  [PROP_DEFAULT_LIMIT_RAM]: number;
  [PROP_DEFAULT_RAM]: number;
  [PROP_DEFAULT_RAM_HEADLESS]: number;
  [PROP_AVAILABLE_RAM]: number[];
  [PROP_AVAILABLE_GPUS]: number[];
}

export interface StatsData {
  [PROP_STATS_INSTANCES]: {
    [PROP_STATS_SESSION]: number;
    [PROP_STATS_DESKTOP_APP]: number;
    [PROP_STATS_HEADLESS]: number;
    [PROP_STATS_TOTAL]: number;
  };
  [PROP_STATS_CORES]: {
    [PROP_STATS_REQUESTED_CPU_CORES]: number;
    [PROP_STATS_CPU_CORES_AVAILABLE]: number;
    [PROP_STATS_MAX_CPU_CORES]: {
      [PROP_STATS_CPU_CORES]: number;
      [PROP_STATS_WITH_RAM]: string;
    };
  };
  [PROP_STATS_RAM]: {
    [PROP_STATS_REQUESTED_RAM]: string;
    [PROP_STATS_RAM_AVAILABLE]: string;
    [PROP_STATS_MAX_RAM]: {
      [PROP_STATS_RAM]: string;
      [PROP_STATS_WITH_CPU_CORES]: number;
    };
  };
}

// Action types
export type AuthAction =
  | { type: typeof LOGIN; payload: { username: string } }
  | { type: typeof LOGOUT }
  | { type: typeof SET_COOKIE; payload: string }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_CONTEXT; payload: Context }
  | { type: typeof SET_SESSIONS_STATS; payload: StatsData }
  | { type: typeof SET_SESSIONS; payload: { sessions: Session[] } }
  | {
      type: typeof SET_IMAGES;
      payload: { images: { [key: string]: { [key: string]: Image[] } } };
    };
