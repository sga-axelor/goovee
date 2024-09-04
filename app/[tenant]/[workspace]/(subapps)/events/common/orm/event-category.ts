// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {ORDER_BY} from '@/constants';
import type {ID, PortalWorkspace} from '@/types';

export async function findEventCategories({
  workspace,
  tenantId,
}: {
  workspace: PortalWorkspace;
  tenantId: ID;
}) {
  if (!(workspace && tenantId)) return [];

  const c = await getClient(tenantId);

  const eventCategories = await c.aOSPortalEventCategory.find({
    where: {
      workspace: {
        id: workspace.id,
      },
    },
    orderBy: {name: ORDER_BY.ASC},
    select: {
      id: true,
      name: true,
      color: true,
      description: true,
    },
  });

  return eventCategories;
}
