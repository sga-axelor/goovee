import moment from 'moment';

// ---- LOCAL IMPORTS ---- //
import {Event} from '@/app/events/common/ui/components';

export const convertDate = (dateString: string) => {
  const date = moment(dateString);
  return date.format('MMMM D YYYY - hA');
};

export const convertDateWithMinutes = (dateString: string) => {
  const date = moment(dateString);
  return date.format('MMMM D YYYY - h:mm A');
};

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

export const datesBetweenTwoDates = (data: Event[]): Date[] => {
  const Dates: Date[] = [];

  data.forEach((event: Event) => {
    const startDate = new Date(event.eventStartDateTime);
    const endDate = new Date(event.eventEndDateTime);
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      Dates.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    }
    Dates.push(
      new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
    );
  });

  const uniqueDates = Dates.filter(
    (date, index, self) => index === self.findIndex(d => isSameDay(d, date)),
  );

  return uniqueDates;
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
