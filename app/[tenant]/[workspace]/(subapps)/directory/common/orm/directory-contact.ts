import {manager} from '@/tenant';

import {getTranslation} from '@/lib/core/i18n/server';
import type {Tenant} from '@/tenant';
import type {ID, PortalWorkspace} from '@/types';

export async function findDirectoryContactById({
  id,
  workspace,
  tenantId,
}: {
  id: ID;
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(id && workspace && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const directoryContact = await c.aOSPortalDirectoryContact.findOne({
    where: {id},
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      linkedinLink: true,
    },
  });
  return directoryContact;
}
