'use server';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {clone} from '@/utils';
import type {PortalWorkspace} from '@/types';

export async function findDmsFiles({
  search = '',
  workspace,
}: {
  search: string;
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  const client = await getClient();

  return client.aOSDMSFile
    .find({
      where: {
        ...(search
          ? {
              fileName: {
                like: `%${search}%`,
              },
            }
          : {}),
        workspaceSet: {
          id: workspace.id,
        },
      },
      select: {
        fileName: true,
        createdBy: true,
        createdOn: true,
        metaFile: true,
        parent: true,
        isDirectory: true,
      },
    })
    .then(clone);
}
