'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {i18n} from '@/i18n';
import {SUBAPP_CODES} from '@/constants';
import {TENANT_HEADER} from '@/middleware';
import type {Comment, ID, Participant} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findEventByID, findEvents} from '@/subapps/events/common/orm/event';
import {findContact} from '@/subapps/events/common/orm/partner';

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
  tenantId,
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
  tenantId?: ID | null;
}) {
  tenantId = headers().get(TENANT_HEADER) || tenantId;

  if (!(workspace && tenantId)) {
    return {events: [], pageInfo: null};
  }
  const workspaceURL = workspace.url;

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
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
      tenantId,
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
  const tenantId = headers().get(TENANT_HEADER);

  if (!(eventId && comment && tenantId)) return error(i18n.get('Bad Request'));

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventByID({id: eventId, tenantId});
  if (!event) return error(i18n.get('Event not found!'));

  try {
    return await createComment({
      id: eventId,
      workspaceURL,
      values: comment,
      tenantId,
    }).then(clone);
  } catch (err) {
    console.log(err);
  }
}

export async function getCommentsByEventID(
  eventId: string,
  workspaceURL: string,
) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!(eventId && tenantId)) return error(i18n.get('Bad Request'));

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventByID({id: eventId, tenantId});
  if (!event) return error(i18n.get('Event not found!'));

  try {
    const comments = await findCommentsByEventID({
      id: eventId,
      workspaceURL,
      tenantId,
    }).then(clone);
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
  const tenantId = headers().get(TENANT_HEADER);

  if (!(eventId && values && tenantId))
    return error(i18n.get('Event ID or values are missing!'));

  if (!workspaceURL) return error(i18n.get('workspaceURL is missing!'));

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
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
      return await registerParticipants({
        eventId,
        workspaceURL,
        values: rest,
        tenantId,
      }).then(clone);
    }
    otherPeople.push(rest);
    otherPeople.forEach((element: Participant) => {
      if (element.emailAddress) {
        element.emailAddress = element.emailAddress.toLowerCase();
      }
    });
    return await registerParticipants({
      eventId,
      workspaceURL,
      values: otherPeople,
      tenantId,
    }).then(clone);
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
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(i18n.get('Bad Request'));
  }

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  if (!tenantId) {
    return error(i18n.get('Bad Request'));
  }

  try {
    const result = await findContact({search, workspaceURL, tenantId}).then(
      clone,
    );
    return result;
  } catch (err) {
    console.log(err);
    return error(i18n.get('Something went wrong!'));
  }
}
