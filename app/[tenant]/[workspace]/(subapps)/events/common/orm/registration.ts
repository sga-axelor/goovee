// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {manager, type Tenant} from '@/tenant';
import type {ID, Participant} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';
import {PartnerTypeMap} from '@/orm/partner';
import {UserType} from '@/lib/core/auth/types';
import {USER_CREATED_FROM} from '@/constants';

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

export async function createEventPartners({
  participants,
  tenantId,
}: {
  participants: Participant[];
  tenantId: Tenant['id'];
}) {
  const partners = await Promise.all(
    participants.map(async participant => {
      const {emailAddress, name, surname, companyName} = participant;
      const c = await manager.getClient(tenantId);
      if (!emailAddress) return;
      const partner = await c.aOSPartner.findOne({
        where: {
          emailAddress: {
            address: emailAddress,
          },
        },
      });
      if (partner) return;
      return c.aOSPartner.create({
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
        },
      });
    }),
  );
  return partners.filter(Boolean);
}
