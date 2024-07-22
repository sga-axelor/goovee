// ---- CORE IMPORTS ---- //
import {isSameDay} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {Event} from '@/subapps/events/common/ui/components';

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
