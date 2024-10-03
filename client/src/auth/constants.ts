// APP constants
export const BASE_HOST_URL = 'https://www.canfar.net';
// API
export const BASE_URL = '/api';
export const LOGIN_URL = '/access/login';
export const LOGOUT_URL = '/access/logout';
export const IMAGE_URL = '/image';
export const SESSION_URL = '/session';
export const SESSION_VIEW_URL = '/session_view';
export const USERINFO_URL = '/userinfo';
export const CONTEXT_URL = '/context';

// Actions
const prefix = '@AUTH';
export const LOGIN = `${prefix}/LOGIN`;
export const SET_IMAGES = `${prefix}/SET_IMAGES`;
export const SET_SESSIONS = `${prefix}/SET_SESSIONS`;
export const LOGOUT = `${prefix}/LOGOUT`;
export const SET_COOKIE = `${prefix}/SET_COOKIE`;
export const SET_LOADING = `${prefix}/SET_LOADING`;

// Images
export const HEADLESS = 'headless';
export const DESKTOP_APP = 'desktop-app';
export const CARTA = 'carta';
export const NOTEBOOK = 'notebook';
export const DESKTOP = 'desktop';
export const CONTRIBUTED = 'contributed';

// Session
export const PROP_ID = 'id';
export const PROP_USERID = 'userid';
export const PROP_RUN_AS_UID = 'runAsUID';
export const PROP_RUN_AS_GID = 'runAsGID';
export const PROP_SUPPLEMENTAL_GROUPS = 'supplementalGroups';
export const PROP_APPID = 'appid';
export const PROP_IMAGE = 'image';
export const PROP_TYPE = 'type';
export const PROP_STATUS = 'status';
export const PROP_NAME = 'name';
export const PROP_START_TIME = 'startTime';
export const PROP_EXPIRY_TIME = 'expiryTime';
export const PROP_CONNECT_URL = 'connectURL';
export const PROP_REQUESTED_RAM = 'requestedRAM';
export const PROP_REQUESTED_CPU_CORES = 'requestedCPUCores';
export const PROP_REQUESTED_GPU_CORES = 'requestedGPUCores';
export const PROP_RAM_IN_USE = 'ramInUse';
export const PROP_GPU_RAM_IN_USE = 'gpuRAMInUse';
export const PROP_CPU_CORES_IN_USE = 'cpuCoresInUse';
export const PROP_GPU_UTILIZATION = 'gpuUtilization';

// UI constants
export const PROP_LOGO = 'logo';
export const SP_IMAGE_URL = '/science-portal/images/';
export const DEFAULT_LOGO = 'fas_cube.png';
