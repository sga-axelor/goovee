// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {ORDER_BY} from '@/constants';
import {PortalWorkspace} from '@/types';

export async function findEventCategories({
  workspace,
}: {
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];
  const c = await getClient();

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
