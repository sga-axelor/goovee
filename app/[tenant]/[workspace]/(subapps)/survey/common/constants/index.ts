import {i18n} from '@/locale';

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
  [SURVEY_STATUS.DRAFT]: i18n.t('Draft'),
  [SURVEY_STATUS.READY]: i18n.t('Ready'),
  [SURVEY_STATUS.PUBLISHED]: i18n.t('Published'),
  [SURVEY_STATUS.CLOSED]: i18n.t('Closed'),
  [SURVEY_STATUS.CANCELLED]: i18n.t('Cancelled'),
};

export const SURVEY_TYPE_NAMES: {[key: number]: string} = {
  [SURVEY_TYPE.INTERNAL]: i18n.t('Internal'),
  [SURVEY_TYPE.EXTERNAL]: i18n.t('External'),
  [SURVEY_TYPE.PUBLIC]: i18n.t('Public'),
};

export const RESPONSE_STATUS_NAMES: {[key: number]: string} = {
  [RESPONSE_STATUS.OPEN]: i18n.t('Open'),
  [RESPONSE_STATUS.IN_PROGRESS]: i18n.t('In progress'),
  [RESPONSE_STATUS.COMPLETED]: i18n.t('Completed'),
};
