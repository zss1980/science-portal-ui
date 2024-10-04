import { session_types as SESSION_TYPES } from '../session/sessiontype_map_en.json';
import { NOTEBOOK, VAL_CORES, VAL_MEMORY } from '../auth/constants';

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
  `${type} ${userSession}`;
