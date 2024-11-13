'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {i18n} from '@/i18n';
import {SUBAPP_CODES} from '@/constants';
import {TENANT_HEADER} from '@/middleware';
import type {Comment, ID, Participant, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findEventByID, findEvents} from '@/subapps/events/common/orm/event';
import {findContact} from '@/subapps/events/common/orm/partner';

import {
  findEventParticipant,
  registerParticipants,
} from '@/subapps/events/common/orm/registration';
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
  tenantId?: any;
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

export async function register({
  eventId,
  values,
  workspace,
}: {
  eventId: any;
  values: any;
  workspace: PortalWorkspace;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!eventId) return error(i18n.get('Event ID is missing!'));
  if (!values) return error(i18n.get('Values are missing!'));
  if (!tenantId) return error(i18n.get('Tenant ID is missing!'));
  if (!workspace) return error(i18n.get('Workspace is missing!'));

  const workspaceURL = workspace.url;
  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventByID({id: eventId, workspace, tenantId});
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
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
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

export async function fetchEventParticipants({
  id,
  workspace,
}: {
  id: ID;
  workspace: PortalWorkspace;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!id) {
    return error(i18n.get('Invalid Event.'));
  }

  if (!tenantId) {
    return error(i18n.get('Bad Request'));
  }

  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }

  const workspaceURL = workspace?.url;

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }
  try {
    const result = await findEventParticipant({
      id,
      workspace,
      tenantId,
    }).then(clone);
    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.log(err);
    return {
      error: true,
      message: i18n.get('Something went wrong!'),
    };
  }
}
