import type {Tenant} from '@/lib/core/tenant';
import {
  type EventConfig,
  type EventConfigPartner,
  findPartnerByEmailForEvent,
} from '../orm/event';
import {endOfDay} from 'date-fns';

export function isAlreadyRegistered({
  event,
  email,
}: {
  event: EventConfig;
  email: string;
}) {
  return event.registrationList?.some(registration => {
    return registration?.participantList?.some(
      participant => participant?.emailAddress === email,
    );
  });
}

export async function canEmailBeRegistered({
  event,
  email,
  tenantId,
}: {
  tenantId: Tenant['id'];
  event: EventConfig;
  email: string;
}): Promise<boolean> {
  if (event.isPrivate) {
    return canRegisterToPrivateEvent({privateEvent: event, email});
  }
  if (!event.isPublic) {
    return await canRegisterToNonPublicEvent({email, tenantId});
  }
  return true;
}

export async function canRegisterToNonPublicEvent({
  email,
  tenantId,
}: {
  tenantId: Tenant['id'];
  email: string;
}): Promise<boolean> {
  const partner = await findPartnerByEmailForEvent(email, tenantId);
  if (!partner?.id || !partner.canSubscribeNoPublicEvent) {
    return false;
  }
  return true;
}

export function canRegisterToPrivateEvent({
  privateEvent,
  email,
}: {
  privateEvent: EventConfig;
  email: string;
}): boolean {
  return !!(email && getAllowedEmailsForPrivateEvent(privateEvent).has(email));
}

export function getAllowedEmailsForPrivateEvent(
  privateEvent: EventConfig,
): Set<string> {
  const allowedEmails =
    privateEvent.partnerCategorySet?.flatMap(category => {
      return category.partners?.flatMap(partner =>
        getPortalUserEmails(partner),
      );
    }) || []; // add emails from partnerCategorySet
  allowedEmails.push(
    ...(privateEvent.partnerSet?.flatMap(partner =>
      getPortalUserEmails(partner),
    ) ?? []),
  ); // add emails from partnerSet
  return new Set(allowedEmails.filter(Boolean) as string[]);
}

export function getPortalUserEmails(partner: EventConfigPartner): string[] {
  const emails = isPortalUser(partner) ? [partner.emailAddress?.address] : []; // add the partner email
  const isCustomer =
    !partner.isContact && (partner.isProspect || partner.isCustomer);
  if (isCustomer) {
    // if partner is a customer, then add emails of its contactPartners
    emails.push(
      ...(partner.contactPartnerSet
        ?.filter(isPortalUser)
        .map(contactPartner => contactPartner.emailAddress?.address) ?? []),
    );
  }
  return emails.filter(Boolean) as string[];
}

export function isPortalUser(partner: {
  isRegisteredOnPortal?: boolean;
  isActivatedOnPortal?: boolean;
}): boolean {
  return !!(partner.isRegisteredOnPortal && partner.isActivatedOnPortal);
}

export function getTotalRegisteredParticipants(event: EventConfig): number {
  if (!event.registrationList) return 0;
  return event.registrationList.reduce((acc, registration) => {
    return acc + (registration.participantList?.length || 0);
  }, 0);
}

export function hasEventEnded(event: {
  eventStartDateTime?: Date | string | null;
  eventEndDateTime?: Date | string | null;
  eventAllDay?: boolean;
}): boolean {
  const startDate = new Date(event.eventStartDateTime ?? '');
  const endDate = new Date(event.eventEndDateTime ?? '');
  const now = Date.now();
  if (event.eventAllDay) return now > endOfDay(startDate).getTime();
  return now > endDate.getTime();
}
