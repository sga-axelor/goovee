'use server';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {Comment, Participant} from '@/types';
import {i18n} from '@/lib/i18n';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {findEventByID, findEvents} from '@/subapps/events/common/orm/event';
import {findContact} from '@/subapps/events/common/orm/partner';
import {
  createComment,
  findCommentsByEventID,
} from '@/subapps/events/common/orm/comment';
import {registerParticipants} from '@/subapps/events/common/orm/registration';
import {error} from '@/subapps/events/common/utils';
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';

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
  workspaceURL,
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
  workspace?: any;
  workspaceURL?: any;
}) {
  if (!workspace) {
    return {events: [], pageInfo: null};
  }
  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

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
  comment: Comment,
  workspaceURL: string,
) {
  if (!eventId || !comment)
    return error(i18n.get('Event ID or comment is missing!'));

  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventByID(eventId);
  if (!event) return error(i18n.get('Event not found!'));

  try {
    return await createComment(eventId, workspaceURL, comment).then(clone);
  } catch (err) {
    console.log(err);
  }
}

export async function getCommentsByEventID(
  eventId: string,
  workspaceURL: string,
) {
  if (!eventId) return error(i18n.get('Event ID is missing!'));

  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventByID(eventId);
  if (!event) return error(i18n.get('Event not found!'));

  try {
    const comments = await findCommentsByEventID(eventId, workspaceURL).then(
      clone,
    );
    return comments;
  } catch (err) {
    console.log(err);
  }
}

export async function register({
  eventId,
  values,
  workspaceURL,
}: {
  eventId: any;
  values: any;
  workspaceURL: string;
}) {
  if (!eventId || !values)
    return error(i18n.get('Event ID or values are missing!'));

  if (!workspaceURL) return error(i18n.get('workspaceURL is missing!'));

  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventByID(eventId);
  if (!event) return error(i18n.get('Event not found!'));

  try {
    const {otherPeople, ...rest} = values;

    if (otherPeople.length === 0) {
      rest.emailAddress = rest.emailAddress.toLowerCase();
      return await registerParticipants(eventId, workspaceURL, rest).then(
        clone,
      );
    }
    otherPeople.push(rest);
    otherPeople.forEach((element: Participant) => {
      if (element.emailAddress) {
        element.emailAddress = element.emailAddress.toLowerCase();
      }
    });
    return await registerParticipants(eventId, workspaceURL, otherPeople).then(
      clone,
    );
  } catch (err) {
    console.log(err);
    return error(i18n.get('Something went wrong!'));
  }
}

export async function fetchContacts({
  search,
  workspaceURL,
}: {
  search: string;
  workspaceURL: string;
}) {
  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

  try {
    const result = await findContact({search, workspaceURL}).then(clone);
    return result;
  } catch (err) {
    console.log(err);
    return error(i18n.get('Something went wrong!'));
  }
}
