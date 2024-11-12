// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import type {ID, Participant, PortalWorkspace} from '@/types';
import {i18n} from '@/i18n';
import {SUBAPP_CODES} from '@/constants';
import {getSession} from '@/auth';

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
  if (!(eventId && tenantId)) return error(i18n.get('Event ID is missing!'));

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
  if (!(id && tenantId)) return error(i18n.get('Event ID is missing!'));

  const event = await findEventByID({id, workspace, tenantId});
  if (!event) {
    return {error: true, message: i18n.get('Event is invalid!')};
  }

  const client = await manager.getClient(tenantId);

  const session = await getSession();
  const user = session?.user;

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
