import { session_types as SESSION_TYPES } from '../session/sessiontype_map_en.json';
import {
  NOTEBOOK,
  VAL_CORES,
  VAL_IMAGE,
  VAL_INSTANCE_NAME,
  VAL_MEMORY,
  VAL_PROJECT,
  VAL_TYPE,
} from '../auth/constants';
import { FormKeys } from '../auth/types';

export const isMemoryDisabled = (type: keyof typeof SESSION_TYPES) => {
  const availableSessions = Object.keys(SESSION_TYPES);
  const sessionType = availableSessions.includes(type)
    ? (type as keyof typeof SESSION_TYPES)
    : NOTEBOOK;

  return !SESSION_TYPES[sessionType].form_fields.includes(VAL_MEMORY);
};

export const isCoresDisabled = (type: keyof typeof SESSION_TYPES) => {
  const availableSessions = Object.keys(SESSION_TYPES);
  const sessionType = availableSessions.includes(type)
    ? (type as keyof typeof SESSION_TYPES)
    : NOTEBOOK;
  return !SESSION_TYPES[sessionType].form_fields.includes(VAL_CORES);
};

export const getDefaultSessionName = (userSession: number) => (type: string) =>
  `${type}${userSession}`;

export const validateAlphanumericHyphen = (value: string) => {
  const regex = /^[a-zA-Z0-9-]+$/;
  return regex.test(value)
    ? undefined
    : 'Only alphanumeric characters and hyphens are allowed';
};

export const getMissedFieldError = (formKey: FormKeys) => {
  switch (formKey) {
    case VAL_TYPE:
      return 'Type is required';
    case VAL_PROJECT:
      return 'Project is required';
    case VAL_IMAGE:
      return 'Image is required';
    case VAL_INSTANCE_NAME:
      return 'Name is required';
    case VAL_MEMORY:
      return 'Memory is required';
    case VAL_CORES:
      return '# of Cores is required';
    default:
      return 'Required';
  }
};
