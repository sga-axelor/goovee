import {i18n} from '@/lib/core/i18n';

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
  [SURVEY_STATUS.DRAFT]: i18n.get('Draft'),
  [SURVEY_STATUS.READY]: i18n.get('Ready'),
  [SURVEY_STATUS.PUBLISHED]: i18n.get('Published'),
  [SURVEY_STATUS.CLOSED]: i18n.get('Closed'),
  [SURVEY_STATUS.CANCELLED]: i18n.get('Cancelled'),
};

export const SURVEY_TYPE_NAMES: {[key: number]: string} = {
  [SURVEY_TYPE.INTERNAL]: i18n.get('Internal'),
  [SURVEY_TYPE.EXTERNAL]: i18n.get('External'),
  [SURVEY_TYPE.PUBLIC]: i18n.get('Public'),
};

export const RESPONSE_STATUS_NAMES: {[key: number]: string} = {
  [RESPONSE_STATUS.OPEN]: i18n.get('Open'),
  [RESPONSE_STATUS.IN_PROGRESS]: i18n.get('In progress'),
  [RESPONSE_STATUS.COMPLETED]: i18n.get('Completed'),
};
