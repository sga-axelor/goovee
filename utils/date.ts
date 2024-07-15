import moment from 'moment';

export function formatDateToISOString(mdate: any) {
  return moment(mdate).utc().format('YYYY-MM-DDTHH:mm[Z]');
}
