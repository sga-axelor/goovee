import icalgen, {
  ICalCalendarMethod,
  ICalEvent,
  ICalEventData,
} from 'ical-generator';

// ---- CORE IMPORTS ---- //
import {isSameDay} from '@/utils/date';
import type {ErrorResponse} from '@/types/action';
import type {ID} from '@goovee/orm';

// ---- LOCAL IMPORTS ---- //
import type {Event} from '@/subapps/events/common/ui/components';

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

export function error(message: string): ErrorResponse {
  return {
    error: true,
    message,
  };
}

export function ical(
  details: ICalEvent | ICalEventData,
  options: {
    name?: string;
    method?: ICalCalendarMethod;
    timezone?: string;
  } = {},
): string {
  const {name, method, timezone} = options;
  const calendar = icalgen({name: name || 'Calendar'});

  calendar.method(method || ICalCalendarMethod.REQUEST);

  if (timezone) {
    calendar.timezone(timezone);
  }

  calendar.createEvent(details);
  return calendar.toString();
}

export function canEmailBeRegistered({
  event,
  partner,
}: {
  event: {
    isPrivate?: boolean;
    isPublic?: boolean;
  };
  partner?: {
    id?: ID;
    isRegisteredOnPortal?: boolean;
    isActivatedOnPortal?: boolean;
    canSubscribeNoPublicEvent?: boolean;
  } | null;
}): boolean {
  if (event.isPrivate) {
    if (
      !partner?.id ||
      !partner.isRegisteredOnPortal ||
      !partner.isActivatedOnPortal
    ) {
      return false;
    }
  }
  if (!event.isPublic) {
    if (!partner?.id || !partner.canSubscribeNoPublicEvent) {
      return false;
    }
  }
  return true;
}

export function isAlreadyRegistered({
  event,
  email,
}: {
  event: {
    registrationList?: {
      participantList?: {
        emailAddress?: string;
      }[];
    }[];
  };
  email: string;
}) {
  return event.registrationList?.some(registration => {
    return registration?.participantList?.some(
      participant => participant?.emailAddress === email,
    );
  });
}
