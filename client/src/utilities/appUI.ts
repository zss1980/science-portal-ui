import { SStatuse } from '../auth/types';
import { ACTIVE, OUTAGE } from '../auth/constants';

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
