import type {Client} from '@/goovee/.generated/client';
import type {Participant} from '../actions/validators';
import {type RegistrationValues} from '../actions/validators';
import {findPartnerByEmailForEvent} from '../orm/event';
import type {
  EventConfig,
  EventConfigPartner,
} from '@/subapps/events/common/types';
import {isEventPrivate, isEventPublic} from './index';

export function isAlreadyRegistered({
  event,
  email,
}: {
  event: EventConfig;
  email: string;
}) {
  return event.registrationList?.some(registration => {
    return registration?.participantList?.some(
      participant =>
        participant?.emailAddress?.toLowerCase() === email.toLowerCase(),
    );
  });
}

export async function canEmailBeRegistered({
  event,
  email,
  client,
}: {
  client: Client;
  event: EventConfig;
  email: string;
}): Promise<boolean> {
  if (isEventPrivate(event)) {
    return canRegisterToPrivateEvent({privateEvent: event, email});
  }
  if (isEventPublic(event)) {
    return true;
  }
  return await canRegisterToNonPublicEvent({email, client});
}

export async function canRegisterToNonPublicEvent({
  email,
  client,
}: {
  client: Client;
  email: string;
}): Promise<boolean> {
  const partner = await findPartnerByEmailForEvent(email, client);
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
  return !!(
    email &&
    getAllowedEmailsForPrivateEvent(privateEvent).has(email.toLowerCase())
  );
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
  const emails = isPortalUser(partner)
    ? [partner.emailAddress?.address?.toLowerCase()]
    : []; // add the partner email
  const isCustomer =
    !partner.isContact && (partner.isProspect || partner.isCustomer);
  if (isCustomer) {
    // if partner is a customer, then add emails of its contactPartners
    emails.push(
      ...(partner.contactPartnerSet
        ?.filter(isPortalUser)
        .map(
          contactPartner => contactPartner.emailAddress?.address ?? undefined,
        ) ?? []),
    );
  }
  return emails.filter(Boolean) as string[];
}

export function isPortalUser(partner: {
  isActivatedOnPortal: boolean | null;
}): boolean {
  return !!partner.isActivatedOnPortal;
}

export function getTotalRegisteredParticipants(event: EventConfig): number {
  if (!event.registrationList) return 0;
  return event.registrationList.reduce((acc, registration) => {
    return acc + (registration.participantList?.length || 0);
  }, 0);
}

export function getParticipantsFromValues(
  values: RegistrationValues,
): Participant[] {
  const {otherPeople = [], ...rest} = values;

  const participants = otherPeople.map(participant => ({
    ...participant,
    emailAddress: participant.emailAddress.toLowerCase(),
  }));
  participants.unshift(rest);
  participants.sort((a, b) => a.sequence - b.sequence);
  return participants;
}
