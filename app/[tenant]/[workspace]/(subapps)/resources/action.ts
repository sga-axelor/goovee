'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';
import {clone} from '@/utils';
import type {PortalWorkspace} from '@/types';
import {TENANT_HEADER} from '@/middleware';

export async function findDmsFiles({
  search = '',
  workspace,
}: {
  search: string;
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) return [];

  const client = await manager.getClient(tenantId);

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
