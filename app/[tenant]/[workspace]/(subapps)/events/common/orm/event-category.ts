// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';
import {ORDER_BY} from '@/constants';
import type {ID, PortalWorkspace} from '@/types';
import type {Tenant} from '@/tenant';

export async function findEventCategories({
  workspace,
  tenantId,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const eventCategories = await c.aOSPortalEventCategory.find({
    where: {
      workspace: {
        id: workspace.id,
      },
    },
    orderBy: {name: ORDER_BY.ASC} as any,
    select: {
      id: true,
      name: true,
      color: true,
      description: true,
    },
  });

  return eventCategories;
}
