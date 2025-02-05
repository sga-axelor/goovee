// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {manager, type Tenant} from '@/tenant';
import type {ID, Participant} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';
import {PartnerTypeMap} from '@/orm/partner';
import {UserType} from '@/lib/core/auth/types';
import {USER_CREATED_FROM} from '@/constants';
import {ExpandRecursively} from '@/types/util';
import {CreateArgs, CreateOptions} from '@goovee/orm';
import {AOSPortalParticipant} from '@/goovee/.generated/models';

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

  const contacts = await getEventContacts({
    participants,
    tenantId,
  });

  const participantList = participants.reduce(
    (acc: any, value) => {
      const {subscriptionSet, ...rest} = value;
      const contact = contacts.find(
        c => c.emailAddress?.address === rest.emailAddress,
      );

      acc.create.push({
        ...rest,
        ...(contact && {contact: {select: {id: contact.id}}}),
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

type EventContact = {
  id: string;
  emailAddress?: {address?: string};
};

export async function getEventContacts({
  participants,
  tenantId,
}: {
  participants: Participant[];
  tenantId: Tenant['id'];
}): Promise<EventContact[]> {
  const partners = await Promise.all(
    participants.map(async participant => {
      const {emailAddress, name, surname, companyName, phone} = participant;
      if (!emailAddress) return;
      const c = await manager.getClient(tenantId);
      const partner = await c.aOSPartner.findOne({
        where: {emailAddress: {address: emailAddress}},
        select: {emailAddress: {address: true}},
      });

      if (partner) return partner;
      const eventContact = await c.aOSPartner.create({
        data: {
          partnerTypeSelect: PartnerTypeMap[UserType.individual],
          emailAddress: {create: {address: emailAddress, name: emailAddress}},
          name: surname,
          firstName: name,
          fullName: `${surname} ${name || ''}`.trim(),
          simpleFullName: `${surname} ${name || ''}`.trim(),
          isContact: true,
          isCustomer: false,
          isProspect: false,
          createdFromSelect: USER_CREATED_FROM,
          isRegisteredOnPortal: false,
          isActivatedOnPortal: false,
          isPublicPartner: true,
          portalCompanyName: companyName,
          mobilePhone: phone,
        },
        select: {emailAddress: {address: true}},
      });
      return eventContact;
    }),
  );
  return partners.filter(Boolean) as EventContact[];
}
