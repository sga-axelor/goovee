// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {manager, type Tenant} from '@/tenant';
import type {ID, Participant} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';

export async function registerParticipants({
  eventId,
  participants,
  tenantId,
}: {
  eventId: ID;
  workspaceURL: string;
  participants: Participant[];
  tenantId: Tenant['id'];
}) {
  if (!tenantId) return error(await t('Tenant ID is missing!'));

  const c = await manager.getClient(tenantId);

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

  return registration;
}
