// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

export async function findContactByName(name: string, workspaceURL: string) {
  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

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
