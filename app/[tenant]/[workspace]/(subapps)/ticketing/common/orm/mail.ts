import {SUBAPP_CODES} from '@/constants';
import {manager, type Tenant} from '@/tenant';
import type {ID} from '@/types';
import type {Maybe} from '@/types/util';

export async function getMailRecipients({
  userId,
  contacts,
  workspaceURL,
  tenantId,
}: {
  contacts: Set<Maybe<ID>>;
  userId: ID;
  workspaceURL: string;
  tenantId: Tenant['id'];
}): Promise<string[]> {
  const reciepients = await Promise.all(
    Array.from(contacts).map(
      contact =>
        contact &&
        String(userId) !== String(contact) && // Exclude the logged in user
        findPartnerNotificationEmail({id: contact, workspaceURL, tenantId}),
    ),
  );

  return reciepients.filter(Boolean) as string[];
}

export async function findPartnerNotificationEmail({
  id,
  workspaceURL,
  tenantId,
}: {
  id: ID;
  workspaceURL: string;
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);

  const partner = await client.aOSPartner.findOne({
    where: {
      id,
      portalUserPreferenceList: {
        app: {code: SUBAPP_CODES.ticketing},
        workspace: {url: workspaceURL},
        activateNotification: true,
      },
    },
    select: {emailAddress: {address: true}},
  });

  return partner?.emailAddress?.address;
}
