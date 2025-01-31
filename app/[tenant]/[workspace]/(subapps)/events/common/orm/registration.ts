// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import type {ID, Participant, PortalWorkspace, User} from '@/types';
import {getTranslation, t} from '@/locale/server';
import {SUBAPP_CODES} from '@/constants';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';
import {findEvent} from '@/subapps/events/common/orm/event';

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
  if (!eventId) return error(await t('Event ID is missing!'));

  if (!tenantId) return error(await t('Tenant ID is missing!'));

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  const c = await manager.getClient(tenantId);

  const participants = Array.isArray(values) ? values : [values];

  const participantList = participants.reduce(
    (acc: any, value) => {
      const {subscriptionSet, ...rest} = value;

      acc.create.push({
        ...rest,
        subscriptionSet: {
          create: subscriptionSet || [],
        },
      });

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
  slug,
  workspace,
  tenantId,
}: {
  slug: string;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!tenantId)
    return error(await getTranslation({}, 'Tenant ID is missing!'));

  if (!slug) return error(await t('Event ID is missing!'));

  const session = await getSession();
  const user = session?.user;

  const event = await findEvent({slug, workspace, tenantId, user});
  if (!event) {
    return {
      error: true,
      message: await getTranslation({tenant: tenantId}, 'Event is invalid!'),
    };
  }

  const client = await manager.getClient(tenantId);

  return client.aOSPortalParticipant.findOne({
    where: {
      registration: {
        event: {
          slug: event.slug,
        },
      },
      emailAddress: user?.email,
    },
    select: {
      emailAddress: true,
    },
  });
}
