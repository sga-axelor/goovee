'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';
import {clone} from '@/utils';
import {TENANT_HEADER} from '@/proxy';
import {getSession} from '@/auth';
import {filterPrivate} from '@/orm/filter';

// ---- LOCAL IMPORTS ---- //
import {FindDmsFilesSchema} from '@/subapps/resources/common/utils/validators';

export async function findDmsFiles({
  search = '',
  workspaceURL,
}: {
  search: string;
  workspaceURL: string;
}) {
  const parsed = FindDmsFilesSchema.safeParse({search, workspaceURL});
  if (!parsed.success) return [];

  const tenantId = (await headers()).get(TENANT_HEADER);

  if (!tenantId) return [];

  const tenant = await manager.getTenant(tenantId);
  if (!tenant) return [];
  const {client} = tenant;

  const session = await getSession();
  const user = session?.user;

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
          url: workspaceURL,
        },
        ...(await filterPrivate({
          user,
          client,
        })),
      },
      select: {
        fileName: true,
        createdBy: {name: true, fullName: true},
        createdOn: true,
        metaFile: {
          description: true,
          sizeText: true,
          createdOn: true,
          updatedOn: true,
          fileName: true,
          filePath: true,
          fileSize: true,
          fileType: true,
        },
        parent: {id: true},
        isDirectory: true,
      },
    })
    .then(clone);
}
