// APP constants
import { FormValues } from './types';

export const BASE_HOST_URL = 'https://www.canfar.net';
export const CADC_BASE_HOST_URL =
  'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/';
export const CADC_GROUPS_URL = '/groups';
export const CADC_SEARCH_URL = '/search';
export const CADC_RESET_URL = '/auth/resetPassword.html';
export const CADC_UPDATE_URL = '/auth/update.html';

export const SCIENCE_PORTAL_URL = `${BASE_HOST_URL}/science-portal`;

// API
export const BASE_URL = '/api';
export const LOGIN_URL = '/access/login';
export const LOGOUT_URL = '/access/logout';
export const IMAGE_URL = '/image';
export const SESSION_URL = '/session';
export const FETCH_SESSION_URL = '/fetch_session';
export const RENEW_SESSION_URL = '/renew_session';
export const DELETE_SESSION_URL = '/delete_session';
export const CREATE_SESSION_URL = '/create_session';
export const SESSION_VIEW_URL = '/session_view';
export const USERINFO_URL = '/userinfo';
export const CONTEXT_URL = '/context';
export const PASSWORD_RESET_URL =
  'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/auth/resetPassword.html';
export const ACCOUNT_REQUEST_URL =
  'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/auth/request.html';

// Actions
const prefix = '@AUTH';
export const SET_AUTHENTICATING = `${prefix}/SET_AUTHENTICATING`;
export const LOGIN = `${prefix}/LOGIN`;
export const SET_IMAGES = `${prefix}/SET_IMAGES`;
export const SET_SESSIONS = `${prefix}/SET_SESSIONS`;
export const SET_SESSION = `${prefix}/SET_SESSION`;
export const SET_SESSIONS_STATS = `${prefix}/SET_SESSIONS_STATS`;
export const SET_DELETE_SESSION_INFO = `${prefix}/SET_DELETE_SESSION_INFO`;
export const CLEAR_DELETE_SESSION_INFO = `${prefix}/CLEAR_DELETE_SESSION_INFO`;
export const SET_CONTEXT = `${prefix}/SET_CONTEXT`;
export const LOGOUT = `${prefix}/LOGOUT`;
export const SET_COOKIE = `${prefix}/SET_COOKIE`;
export const SET_LOADING = `${prefix}/SET_LOADING`;
export const FETCH_FAILED = `${prefix}/FETCH_FAILED`;

// State
export const AUTHENTICATING = 'authenticating';
export const SESSION_STATS = 'session_stats';
export const AVAILABLE_IMAGES = 'available_images';
export const RUNNING_SESSIONS = 'running_sessions';
export const FETCHING_SESSION = 'fetching_session';
export const RENEW_SESSION = 'renew_session';
export const DELETE_SESSION = 'delete_session';
export const CREATE_SESSION = 'create_session';
export const OPERATIONAL = 'operational';
export const OUTAGE = 'outage';
export const ACTIVE = 'active';

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

// Context PROPS
export const PROP_DEFAULT_REQUEST_CORES = 'defaultRequestCores';
export const PROP_DEFAULT_LIMIT_CORES = 'defaultLimitCores';
export const PROP_DEFAULT_CORES = 'defaultCores';
export const PROP_DEFAULT_CORES_HEADLESS = 'defaultCoresHeadless';
export const PROP_AVAILABLE_CORES = 'availableCores';
export const PROP_DEFAULT_REQUEST_RAM = 'defaultRequestRAM';
export const PROP_DEFAULT_LIMIT_RAM = 'defaultLimitRAM';
export const PROP_DEFAULT_RAM = 'defaultRAM';
export const PROP_DEFAULT_RAM_HEADLESS = 'defaultRAMHeadless';
export const PROP_AVAILABLE_RAM = 'availableRAM';
export const PROP_AVAILABLE_GPUS = 'availableGPUs';

// UI constants
export const PROP_LOGO = 'logo';
export const SP_IMAGE_URL = '/science-portal/images/';
export const DEFAULT_LOGO = 'fas_cube.png';

// Form
// Constants
export const VAL_PROJECT = 'project';
export const VAL_TYPE = 'type';
export const VAL_IMAGE = 'image';
export const VAL_INSTANCE_NAME = 'instanceName';
export const VAL_MEMORY = 'memory';
export const VAL_CORES = 'cores';
export const VAL_GPU = 'gpu';

export const NEW_SESSION_INITIAL_VALUES: FormValues = {
  [VAL_PROJECT]: '',
  [VAL_TYPE]: '',
  [VAL_IMAGE]: '',
  [VAL_INSTANCE_NAME]: '',
  [VAL_MEMORY]: 2,
  [VAL_CORES]: 2,
  [VAL_GPU]: 0,
};

// New Session props
export const PROP_SESSION_TYPE = 'sessionType';
export const PROP_SESSION_NAME = 'sessionName';
export const PROP_SESSION_IMAGE = 'sessionImage';
export const PROP_SESSION_RAM = 'sessionRam';
export const PROP_SESSION_CORES = 'sessionCores';

// Stats props
// Instance properties
export const PROP_STATS_INSTANCES = 'instances';
export const PROP_STATS_SESSION = 'session';
export const PROP_STATS_DESKTOP_APP = 'desktopApp';
export const PROP_STATS_HEADLESS = 'headless';
export const PROP_STATS_TOTAL = 'total';

// Core properties
export const PROP_STATS_REQUESTED_CPU_CORES = 'requestedCPUCores';
export const PROP_STATS_CPU_CORES_AVAILABLE = 'cpuCoresAvailable';
export const PROP_STATS_MAX_CPU_CORES = 'maxCPUCores';
export const PROP_STATS_CPU_CORES = 'cpuCores';
export const PROP_STATS_CORES = 'cores';
export const PROP_STATS_WITH_RAM = 'withRam';

// RAM properties
export const PROP_STATS_REQUESTED_RAM = 'requestedRAM';
export const PROP_STATS_RAM_AVAILABLE = 'ramAvailable';
export const PROP_STATS_MAX_RAM = 'maxRAM';
export const PROP_STATS_RAM = 'ram';
export const PROP_STATS_WITH_CPU_CORES = 'withCPUCores';
