import moment from 'moment';

// ---- CORE IMPORTS ---- //
import {DATE_FORMATS} from '@/constants';
import {TIME_UNITS} from '@/constants/units';

export function parseDate(
  dateString: any,
  format: string = DATE_FORMATS.us_date,
) {
  return moment(dateString).format(format);
}

export function formatDateToISOString(mdate: any) {
  return moment(mdate).utc().format(DATE_FORMATS.iso_8601_utc_timestamp);
}

export function getCurrentDateTime() {
  return moment().format(DATE_FORMATS.timestamp_with_microseconds);
}

export const convertDateToISO8601 = (date: Date | undefined) => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const dateIsExist = (dateToCheck: Date, datesArray: Date[]) => {
  const formattedDateToCheck = new Date(dateToCheck).toISOString();

  for (let date of datesArray) {
    const formattedDate = new Date(date).toISOString();
    if (formattedDate === formattedDateToCheck) {
      return true;
    }
  }

  return false;
};

export function getPublishedLabel(dateString: any) {
  if (!dateString) {
    return null;
  }

  const dateMoment = moment(dateString);
  const now = moment();
  const timeDifference = now.diff(
    dateMoment,
    TIME_UNITS.MINUTES as moment.unitOfTime.DurationConstructor,
  );

  const units = [
    {unit: TIME_UNITS.MONTH, divisor: 24 * 60 * 30},
    {unit: TIME_UNITS.DAY, divisor: 24 * 60},
    {unit: TIME_UNITS.HOUR, divisor: 60},
    {unit: TIME_UNITS.MINUTE, divisor: 1},
  ];

  for (const {unit, divisor} of units) {
    if (timeDifference >= divisor) {
      const count = Math.floor(timeDifference / divisor);
      return `${count} ${unit}${count === 1 ? '' : 's'} ${TIME_UNITS.AGO}`;
    }
  }

  return TIME_UNITS.NOW;
}
