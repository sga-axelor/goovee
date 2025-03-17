import {SUBAPP_CODES} from '@/constants';
import {findPartnerPreference} from '@/orm/notification';
import type {Tenant} from '@/tenant';
import type {UTicket} from './tickets';

export async function getMailRecipients({
  newTicket,
  oldTicket,
  exclude = [],
  workspaceURL,
  tenantId,
}: {
  newTicket: UTicket;
  oldTicket?: UTicket;
  exclude?: string[];
  workspaceURL: string;
  tenantId: Tenant['id'];
}): Promise<string[]> {
  const reciepients = Object.values(
    [
      newTicket.createdByContact,
      newTicket.managedByContact,
      oldTicket?.managedByContact,
    ].reduce(
      (acc, contact) => {
        if (!contact?.emailAddress?.address) return acc;
        if (exclude.includes(contact.emailAddress.address)) return acc;
        acc[contact.emailAddress.address] ??= contact as {
          id: string;
          emailAddress: {address: string};
        }; // only keep unique contacts
        return acc;
      },
      {} as Record<string, {id: string; emailAddress: {address: string}}>,
    ),
  );

  const preferences = await Promise.all(
    reciepients.map(async contact => {
      const preference = await findPartnerPreference({
        code: SUBAPP_CODES.ticketing,
        user: {id: contact.id} as any,
        url: workspaceURL,
        tenantId,
      });
      return {
        email: contact.emailAddress!.address!,
        activateNotification: Boolean(preference?.activateNotification),
      };
    }),
  );

  return preferences.filter(p => p.activateNotification).map(p => p.email);
}
