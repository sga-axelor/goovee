import {STATUS_NAMES} from '@/subapps/survey/common/constants';

export const getStatusName = (value: number): string => {
  return STATUS_NAMES[value];
};
