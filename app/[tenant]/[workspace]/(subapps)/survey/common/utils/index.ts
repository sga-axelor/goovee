import {
  STATUS_NAMES,
  SURVEY_TYPE_NAMES,
} from '@/subapps/survey/common/constants';

export const getStatusName = (value: number): string => {
  return STATUS_NAMES[value];
};

export const getSurveyTypeName = (value: number): string => {
  return SURVEY_TYPE_NAMES[value];
};
