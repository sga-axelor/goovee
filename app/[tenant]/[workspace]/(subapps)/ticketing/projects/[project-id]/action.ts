'use server';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';
import {ID} from '@goovee/orm';
import {getClient} from '@/goovee';
import {clone} from '@/utils';

export async function findTickets({
  search = '',
  workspace,
  projectId,
}: {
  search: string;
  workspace: PortalWorkspace;
  projectId?: ID;
}) {
  if (!workspace || !projectId) return [];
  const client = await getClient();
  const tickets = await client.aOSProjectTask
    .find({
      where: {
        project: {
          id: projectId,
        },
        name: {
          like: `%${search}%`,
        },
      },
      take: 10,
      select: {
        name: true,
      },
    })
    .then(clone);
  return tickets;
}
