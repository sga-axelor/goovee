// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import type {ID, Participant} from '@/types';

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

export async function createParticipant(values: Participant) {
  const c = await getClient();

  const participant = await c.aOSPortalParticipant.create({
    data: {
      name: values.name,
      surname: values.surname,
      emailAddress: values.emailAddress,
      phone: values.phone,
      contact:
        values.contact != null
          ? !values.contact?.id
            ? {
                create: {
                  ...values.contact,
                },
              }
            : {
                select: {
                  id: values.contact?.id,
                },
              }
          : {},
    },
  });

  return participant;
}

export async function registerParticipant(eventId: ID, values: any) {
  if (!eventId) return null;

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

  return registration;
}

export async function registerParticipants(
  eventId: ID,
  valuesList: Participant[],
) {
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

  return registration;
}
