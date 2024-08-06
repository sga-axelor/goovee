// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import type {ID, Participant} from '@/types';
import {getSession} from '@/orm/auth';
import {i18n} from '@/lib/i18n';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

export async function findParticipant(participantId: ID) {
  if (!participantId) return null;

  const c = await getClient();

  const participant = await c.aOSPortalParticipant.findOne({
    where: {
      id: participantId,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      emailAddress: true,
      phone: true,
      company: true,
      contactAttrs: true,
      contact: {
        id: true,
        name: true,
        firstName: true,
        fullName: true,
      },
    },
  });

  return participant;
}

export async function findParticipantByName(participantName: string) {
  if (!participantName) return null;

  const c = await getClient();

  const participant = await c.aOSPortalParticipant.find({
    where: {
      OR: [
        {
          name: {
            like: `%${participantName.toLowerCase()}%`,
          },
        },
        {
          surname: {
            like: `%${participantName.toLowerCase()}%`,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      surname: true,
      emailAddress: true,
      phone: true,
      company: true,
      contactAttrs: true,
      contact: {
        id: true,
        name: true,
        firstName: true,
        fullName: true,
      },
    },
  });

  return participant;
}

export async function findParticipants() {
  const c = await getClient();

  const participants = await c.aOSPortalParticipant.find({
    select: {
      id: true,
      name: true,
      surname: true,
      emailAddress: true,
      phone: true,
      company: true,
      contactAttrs: true,
    },
  });

  return participants;
}

export async function registerParticipant(
  eventId: ID,
  workspaceURL: string,
  values: any,
) {
  if (!eventId) return null;

  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  const c = await getClient();

  const registration = await c.aOSRegistration.create({
    data: {
      event: {
        select: {
          id: eventId,
        },
      },
      participantList: {
        create: [values],
      },
    },
  });

  return {success: true, data: registration};
}

export async function registerParticipants(
  eventId: ID,
  workspaceURL: string,
  valuesList: Participant[],
) {
  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  if (!eventId) return null;

  const c = await getClient();

  const participantList = valuesList.reduce(
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
