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
  SESSION_STATS,
  AVAILABLE_IMAGES,
  RUNNING_SESSION,
  OPERATIONAL,
  OUTAGE,
  ACTIVE,
  FETCH_FAILED,
  AUTHENTICATING,
  CLEAR_DELETE_SESSION_INFO,
  SET_DELETE_SESSION_INFO,
  DELETE_SESSION,
  PROP_SESSION_TYPE,
  PROP_SESSION_NAME,
  PROP_SESSION_IMAGE,
  PROP_SESSION_RAM,
  PROP_SESSION_CORES,
  CREATE_SESSION,
} from './constants';

// State interface
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
  };
  cookie: string;
  images: { [key: string]: { [key: string]: Image[] } };
  sessions: Session[];
  context: Context | null;
  usage: PlatformUsage | null;
  loading: {
    [AUTHENTICATING]: boolean;
    [DELETE_SESSION]: boolean;
    [CREATE_SESSION]: boolean;
    [SESSION_STATS]: boolean;
    [AVAILABLE_IMAGES]: boolean;
    [RUNNING_SESSION]: boolean;
  };
  services_statuses: ServiceStatus;
  deleteSessionInfo: SessionDeleteInfo;
}

export interface SessionDeleteInfo {
  showModal: boolean;
  sessionId: string;
  sessionName: string;
}

export type SStatuse = typeof OPERATIONAL | typeof OUTAGE | typeof ACTIVE;

export interface Status {
  status: SStatuse;
  message: string;
}

export interface ServiceStatus {
  [SESSION_STATS]: Status;
  [CREATE_SESSION]: Status;
  [DELETE_SESSION]: Status;
  [AVAILABLE_IMAGES]: Status;
  [RUNNING_SESSION]: Status;
  [AUTHENTICATING]: Status;
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

export interface StandardSession {
  [PROP_SESSION_TYPE]: ImageType;
  [PROP_SESSION_NAME]: string;
  [PROP_SESSION_IMAGE]: string;
}

export interface NewSession extends StandardSession {
  [PROP_SESSION_RAM]?: number;
  [PROP_SESSION_CORES]?: number;
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

export interface PlatformUsage {
  updated: string;
  cpu: {
    used: number;
    free: number;
    total: number;
    display: {
      free: string;
      total: string;
    };
  };
  ram: {
    unit: string;
    used: number;
    free: number;
    total: number;
    display: {
      free: string;
      total: string;
    };
  };
  instances: {
    labels: string[];
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    total: number;
    biggestCount: number;
  };
  listType: string;
}

export type UiLoading =
  | typeof SESSION_STATS
  | typeof RUNNING_SESSION
  | typeof AVAILABLE_IMAGES
  | typeof AUTHENTICATING
  | typeof CREATE_SESSION
  | typeof DELETE_SESSION;

// Action types
export type AuthAction =
  | { type: typeof LOGIN; payload: { username: string } }
  | { type: typeof LOGOUT }
  | { type: typeof SET_COOKIE; payload: string }
  | {
      type: typeof SET_LOADING;
      payload: { type: UiLoading; isLoading: boolean };
    }
  | {
      type: typeof FETCH_FAILED;
      payload: { type: UiLoading; message: string };
    }
  | { type: typeof SET_CONTEXT; payload: Context }
  | { type: typeof SET_SESSIONS_STATS; payload: PlatformUsage }
  | { type: typeof SET_SESSIONS; payload: { sessions: Session[] } }
  | {
      type: typeof SET_DELETE_SESSION_INFO;
      payload: Omit<SessionDeleteInfo, 'showModal'>;
    }
  | { type: typeof CLEAR_DELETE_SESSION_INFO }
  | {
      type: typeof SET_IMAGES;
      payload: { images: { [key: string]: { [key: string]: Image[] } } };
    };
