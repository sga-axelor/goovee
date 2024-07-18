// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {ORDER_BY} from '@/constants';

export async function findEventCategories() {
  const c = await getClient();

  const eventCategories = await c.aOSPortalEventCategory.find({
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
