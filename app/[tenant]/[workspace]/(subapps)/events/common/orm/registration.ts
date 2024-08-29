// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import type {ID, Participant} from '@/types';
import {i18n} from '@/lib/i18n';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';

export async function registerParticipants(
  eventId: ID,
  workspaceURL: string,
  values: Participant | Participant[],
) {
  if (!eventId) return error(i18n.get('Event ID is missing!'));

  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

  const c = await getClient();

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
