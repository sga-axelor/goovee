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

export const STATUS_NAMES: {[key: number]: string} = {
  [SURVEY_STATUS.DRAFT]: 'Draft',
  [SURVEY_STATUS.READY]: 'Ready',
  [SURVEY_STATUS.PUBLISHED]: 'Published',
  [SURVEY_STATUS.CLOSED]: 'Closed',
  [SURVEY_STATUS.CANCELLED]: 'Cancelled',
};
