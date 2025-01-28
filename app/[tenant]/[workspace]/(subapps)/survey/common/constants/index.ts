export const DEFAULT_TABLE_LIMIT = 10;

export const SURVEY_URL_PARAMS = {
  page: 'page',
  responsePage: 'responsePage',
};

export const SURVEY_STATUS = {
  DRAFT: 0,
  READY: 1,
  PUBLISHED: 2,
  CLOSED: 3,
  CANCELLED: 4,
};

export const SURVEY_TYPE = {
  INTERNAL: 1,
  EXTERNAL: 2,
  PUBLIC: 3,
};

export const RESPONSE_STATUS = {
  OPEN: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
};

export const STATUS_NAMES: {[key: number]: string} = {
  [SURVEY_STATUS.DRAFT]: 'Draft',
  [SURVEY_STATUS.READY]: 'Ready',
  [SURVEY_STATUS.PUBLISHED]: 'Published',
  [SURVEY_STATUS.CLOSED]: 'Closed',
  [SURVEY_STATUS.CANCELLED]: 'Cancelled',
};

export const SURVEY_TYPE_NAMES: {[key: number]: string} = {
  [SURVEY_TYPE.INTERNAL]: 'Internal',
  [SURVEY_TYPE.EXTERNAL]: 'External',
  [SURVEY_TYPE.PUBLIC]: 'Public',
};

export const RESPONSE_STATUS_NAMES: {[key: number]: string} = {
  [RESPONSE_STATUS.OPEN]: 'Open',
  [RESPONSE_STATUS.IN_PROGRESS]: 'In progress',
  [RESPONSE_STATUS.COMPLETED]: 'Completed',
};
