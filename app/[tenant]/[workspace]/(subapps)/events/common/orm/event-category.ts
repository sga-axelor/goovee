// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';

export async function findEventCategories() {
  const c = await getClient();

  const eventCategories = await c.aOSPortalEventCategory.find({
    orderBy: {name: 'ASC'},
    select: {
      id: true,
      name: true,
      color: true,
      description: true,
    },
  });

  return eventCategories;
}
