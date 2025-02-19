import icalgen, {
  ICalCalendarMethod,
  ICalEvent,
  ICalEventData,
} from 'ical-generator';

// ---- CORE IMPORTS ---- //
import type {ErrorResponse} from '@/types/action';
import {isSameDay} from '@/utils/date';
import {Participant} from '@/types';
import {extractCustomData} from '@/ui/form';

// ---- LOCAL IMPORTS ---- //
import type {Event} from '@/subapps/events/common/ui/components';
import {endOfDay} from 'date-fns';

export const datesBetweenTwoDates = (data: Event[]): Date[] => {
  const Dates: Date[] = [];

  data.forEach((event: Event) => {
    const startDate = new Date(event.eventStartDateTime);

    if (event.eventAllDay) {
      Dates.push(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        ),
      );
      return;
    }

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

export const generateIcs = (event: any, participants: Participant[]) => {
  const attendees: any = participants.map(participant => ({
    email: participant.emailAddress,
    name: `${participant.name} ${participant.surname}`,
    rsvp: true,
    role: 'REQ-PARTICIPANT',
    status: 'NEEDS-ACTION',
  }));

  return ical({
    start: event.eventStartDateTime,
    end: getEventEndDate(event),
    summary: event.eventTitle,
    location: event.eventPlace,
    description: event.eventDescription,
    attendees,
  });
};

export function mapParticipants(formValues: any, metaFields: any) {
  const data = extractCustomData(formValues, 'contactAttrs', metaFields);
  data.sequence = 0;

  if (!data.addOtherPeople) {
    data.otherPeople = [];
  } else {
    data.otherPeople = data.otherPeople?.map((person: any, index: number) => ({
      ...extractCustomData(person, 'contactAttrs', metaFields),
      sequence: index + 1,
    }));
  }

  return data;
}

export function getPartnerAddress(user: any): string {
  if (!user) return '';

  if (user.isContact) {
    return user.mainAddress?.formattedFullName || '';
  }

  const partnerAddresses = user.partnerAddressList || [];
  if (partnerAddresses.length === 0) return '';

  const address =
    partnerAddresses.find((addr: any) => addr.isInvoicingAddr)?.address ||
    partnerAddresses[0]?.address;

  return address?.formattedFullName || '';
}

export function getEventEndDate(event: {
  eventStartDateTime?: Date | string;
  eventEndDateTime?: Date | string;
  eventAllDay?: boolean;
}): string | Date | undefined {
  const {eventStartDateTime, eventEndDateTime, eventAllDay} = event;

  if (eventAllDay) {
    if (!eventStartDateTime) return;
    return endOfDay(eventStartDateTime);
  }
  return eventEndDateTime;
}

export function isLoginNeededForRegistration(event: {
  isPrivate?: boolean;
  isLoginNotNeeded?: boolean;
}): boolean {
  return event.isPrivate || !event.isLoginNotNeeded;
}

export function isEventPublic(event: {
  isPrivate?: boolean;
  isPublic?: boolean;
  isLoginNotNeeded?: boolean;
}): boolean {
  return !!(!event.isPrivate && event.isLoginNotNeeded && event.isPublic);
}

export function isEventPrivate(event: {
  isPrivate?: boolean;
  isPublic?: boolean;
  isLoginNotNeeded?: boolean;
}): boolean {
  return !!event.isPrivate;
}
