// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';
import {ORDER_BY} from '@/constants';
import type {PortalWorkspace, User} from '@/types';
import type {Tenant} from '@/tenant';
import {filterPrivate} from '@/orm/filter';

export async function findEventCategories({
  workspace,
  tenantId,
  user,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!(workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const eventCategories = await c.aOSPortalEventCategory.find({
    where: {
      workspace: {
        id: workspace.id,
      },
      ...(await filterPrivate({user, tenantId})),
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
