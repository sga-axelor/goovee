import {
  RESPONSE_STATUS_NAMES,
  STATUS_NAMES,
  SURVEY_TYPE_NAMES,
} from '@/subapps/survey/common/constants';

export const getStatusName = (value: number): string => {
  return STATUS_NAMES[value];
};

export const getSurveyTypeName = (value: number): string => {
  return SURVEY_TYPE_NAMES[value];
};

export const getResponseStatusName = (value: number): string => {
  return RESPONSE_STATUS_NAMES[value];
};
