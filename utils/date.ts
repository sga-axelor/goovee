import moment from 'moment';
// ---- CORE IMPORTS ---- //
import {DATE_FORMATS} from '@/constants';

export function formatDateToISOString(mdate: any) {
  return moment(mdate).utc().format(DATE_FORMATS.iso_8601_utc_timestamp);
}

export function getCurrentDateTime() {
  return moment().format(DATE_FORMATS.timestamp_with_microseconds);
}
