// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';

export async function findContactByName(name: string) {
  if (!name) return null;

  const c = await getClient();

  const result = await c.aOSPartner.find({
    where: {
      AND: [
        {
          simpleFullName: {
            like: `%${name.toLowerCase()}%`,
          },
        },
        {
          isContact: {
            eq: true,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      firstName: true,
      simpleFullName: true,
      emailAddress: true,
      fixedPhone: true,
      mainPartner: true,
    },
  });

  return result;
}
