// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';

import type {PortalWorkspace} from '@/types';
import type {Tenant} from '@/tenant';

export async function findDirectoryCategories({
  workspace,
  tenantId,
}: {
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const directoryCategories = await c.aOSPortalDirectoryCategory.find({
    select: {
      id: true,
      title: true,
      color: true,
    },
  });
  return directoryCategories;
}
