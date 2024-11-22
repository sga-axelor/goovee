// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import type {ID, Participant, PortalWorkspace, User} from '@/types';
import {getTranslation} from '@/i18n/server';
import {SUBAPP_CODES} from '@/constants';
import {getSession} from '@/auth';
import {filterPrivate} from '@/orm/filter';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';
import {findEventByID} from '@/subapps/events/common/orm/event';

export async function registerParticipants({
  eventId,
  workspaceURL,
  values,
  tenantId,
}: {
  eventId: ID;
  workspaceURL: string;
  values: Participant | Participant[];
  tenantId: Tenant['id'];
}) {
  if (!eventId) return error(await getTranslation('Event ID is missing!'));

  if (!tenantId) return error(await getTranslation('Tenant ID is missing!'));

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  const c = await manager.getClient(tenantId);

  const participants = Array.isArray(values) ? values : [values];

  const participantList = participants.reduce(
    (acc: any, value) => {
      acc.create.push(value);
      return acc;
    },
    {
      create: [],
    },
  );

  const registration = await c.aOSRegistration.create({
    data: {
      event: {
        select: {
          id: eventId,
        },
      },
      participantList: participantList,
    },
  });

  return {success: true, data: registration};
}

export async function findEventParticipant({
  id,
  workspace,
  tenantId,
}: {
  id: ID;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!id) return error(await getTranslation('Event ID is missing!'));

  if (!tenantId) return error(await getTranslation('Tenant ID is missing!'));

  const session = await getSession();
  const user = session?.user;

  const event = await findEventByID({id, workspace, tenantId, user});
  if (!event) {
    return {
      error: true,
      message: await getTranslation('Event is invalid!', {tenantId}),
    };
  }

  const client = await manager.getClient(tenantId);

  return client.aOSPortalParticipant.findOne({
    where: {
      registration: {
        event: {
          id: event.id,
        },
      },
      emailAddress: user?.email,
    },
  });
}
