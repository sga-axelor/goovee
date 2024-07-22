'use server';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {Comment, Participant, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findEvent, findEvents} from '@/subapps/events/common/orm/event';
import {findContactByName} from '@/subapps/events/common/orm/partner';
import {
  createComment,
  findCommentsForEvent,
} from '@/subapps/events/common/orm/comment';
import {
  findParticipant,
  findParticipantByName,
  registerParticipant,
  registerParticipants,
} from '@/subapps/events/common/orm/registration';

export async function getAllEvents({
  limit,
  page,
  categories,
  search,
  day,
  month,
  year,
  dates,
  workspace,
}: {
  limit?: number;
  page?: number;
  categories?: any[];
  filter?: string;
  search?: string;
  day?: string | number;
  month?: number;
  year?: number;
  dates?: [Date | undefined];
  workspace?: PortalWorkspace;
}) {
  try {
    const {events, pageInfo} = await findEvents({
      limit: limit,
      page: page,
      categoryids: categories,
      day: day,
      search: search,
      month: month,
      year: year,
      selectedDates: dates,
      workspace,
    }).then(clone);
    return {events, pageInfo};
  } catch (err) {
    console.log(err);
  }
}
export async function addComment(
  eventId: string,
  authorId: string,
  comment: Comment,
) {
  if (!eventId || !authorId || !comment) return undefined;
  const event = await findEvent(eventId);
  if (!event) return undefined;

  try {
    const record = await createComment(eventId, authorId, comment).then(clone);
    return record;
  } catch (err) {
    console.log(err);
  }
}
export async function getCommentsByEvent(eventId: string) {
  if (!eventId) return undefined;
  const event = await findEvent(eventId);
  if (!event) return undefined;
  try {
    const comments = findCommentsForEvent(eventId).then(clone);
    return comments;
  } catch (err) {
    console.log(err);
  }
}
export async function eventRegistration(eventId: any, form: any) {
  if (!eventId || !form) return undefined;
  const event = await findEvent(eventId);
  if (!event) return undefined;
  try {
    const {otherPeople, ...rest} = form;
    if (otherPeople.length === 0) {
      rest.emailAddress = rest.emailAddress.toLowerCase();
      const record = await registerParticipant(eventId, rest).then(clone);
      return record;
    }
    otherPeople.push(rest);
    otherPeople.forEach((element: Participant) => {
      if (element.emailAddress) {
        element.emailAddress = element.emailAddress.toLowerCase();
      }
    });
    const record = await registerParticipants(eventId, otherPeople).then(clone);

    return record;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
export async function searchParticipant(input: string) {
  if (!input) return undefined;
  try {
    const participants = await findParticipantByName(input).then(clone);
    return participants;
  } catch (err) {
    console.log(err);
  }
}

export async function searchContacts(input: string) {
  try {
    const result = await findContactByName(input).then(clone);
    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getParticipantById(id: string | number) {
  if (!id) return undefined;
  try {
    const participant = await findParticipant(id).then(clone);

    return participant;
  } catch (err) {
    console.log(err);
  }
}
