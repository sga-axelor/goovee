import {manager} from '@/tenant';

import type {ID, PortalWorkspace} from '@/types';
import type {Tenant} from '@/tenant';

export async function findDirectoryContactById({
  id,
  workspace,
  tenantId,
}: {
  id: ID;
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(id && workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const directoryContact = await c.aOSPortalDirectoryContact.findOne({
    where: {
      id,
    },
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
