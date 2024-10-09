import {
  AlertInfo,
  AuthState,
  Service,
  ServiceStatus,
  SStatuse,
} from '../auth/types';
import {
  ACTIVE,
  AVAILABLE_IMAGES,
  CREATE_SESSION,
  DELETE_SESSION,
  OUTAGE,
  RENEW_SESSION,
  RUNNING_SESSION,
  SESSION_STATS,
} from '../auth/constants';

export const getProgressBarVariant = (status: SStatuse): string => {
  switch (status) {
    case ACTIVE:
      return 'primary';
    case OUTAGE:
      return 'danger';
    default:
      return 'success';
  }
};
export const NEW_SESSION_SERVICES: Service[] = [
  AVAILABLE_IMAGES,
  CREATE_SESSION,
];
export const ACTIVE_SESSION_SERVICES: Service[] = [
  RUNNING_SESSION,
  RENEW_SESSION,
  DELETE_SESSION,
];
export const STATS_SERVICES: Service[] = [SESSION_STATS];
export const getAlerts = (state: AuthState, services: Service[]) => {
  const newSessionEvents = services.map((ev) => {
    return {
      type: ev,
      ...state.services_statuses[ev],
    };
  });

  return newSessionEvents.reduce((acc, ev) => {
    if (ev.status === OUTAGE) {
      // create an alert
      acc.push({
        show: true,
        status: OUTAGE,
        message: ev.message,
      });
    }
    return acc;
  }, [] as AlertInfo[]);
};
