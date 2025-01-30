'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {t} from '@/locale/server';
import {SUBAPP_CODES} from '@/constants';
import {TENANT_HEADER} from '@/middleware';
import type {ID, Participant, PortalWorkspace, User} from '@/types';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {findEventByID, findEvents} from '@/subapps/events/common/orm/event';
import {findContacts} from '@/subapps/events/common/orm/partner';
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
  user,
  onlyRegisteredEvent = false,
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
  user?: User;
  onlyRegisteredEvent?: boolean;
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
      limit,
      page,
      categoryids: categories,
      day,
      search,
      month,
      year,
      selectedDates: dates,
      workspace,
      tenantId,
      user,
      onlyRegisteredEvent,
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

  if (!eventId) return error(await t('Event ID is missing!'));

  if (!values) return error(await t('Values are missing!'));

  if (!tenantId) return error(await t('Tenant ID is missing!'));

  if (!workspace) return error(await t('Workspace is missing!'));

  const workspaceURL = workspace.url;
  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }
  const session = await getSession();
  const user = session?.user;

  const event = await findEventByID({id: eventId, workspace, tenantId, user});
  if (!event) return error(await t('Event not found!'));

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
    return error(await t('Something went wrong!'));
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
    return error(await t('Bad Request'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await t('Unauthorized'));
  }

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  try {
    const result = await findContacts({search, workspaceURL, tenantId}).then(
      clone,
    );
    return result;
  } catch (err) {
    console.log(err);
    return error(await t('Something went wrong!'));
  }
}

export async function fetchEventParticipants({
  id,
  workspace,
  user,
}: {
  id: ID;
  workspace: PortalWorkspace;
  user?: User;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!user?.email) {
    return {
      isRegistered: false,
    };
  }
  if (!id) {
    return error(await t('Invalid Event.'));
  }

  if (!tenantId) {
    return error(await t('Bad Request'));
  }

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
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
    const result: any = await findEventParticipant({
      id,
      workspace,
      tenantId,
    }).then(clone);

    const emailAddress = result?.emailAddress;
    return {
      isRegistered: emailAddress === user.email,
    };
  } catch (err) {
    console.log(err);
    return {
      error: true,
      message: await t('Something went wrong!'),
    };
  }
}
