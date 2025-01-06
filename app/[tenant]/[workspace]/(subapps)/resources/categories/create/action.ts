'use server';

import {headers} from 'next/headers';
import {revalidatePath} from 'next/cache';

// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';
import {t} from '@/locale/server';
import {getSession} from '@/auth';
import {findWorkspace, findSubappAccess} from '@/orm/workspace';
import {clone} from '@/utils';
import {SUBAPP_CODES} from '@/constants';
import {TENANT_HEADER} from '@/middleware';

// ---- LOCAL IMPORTS ---- //
import {fetchFile} from '@/subapps/resources/common/orm/dms';
import {ACTION} from '../../common/constants';

export async function create(formData: FormData, workspaceURL: string) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon')!;
  const parentId = formData.get('parent')!;
  const color = formData.get('color')!;

  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Workspace not provided.'),
    };
  }

  if (!title) {
    return {
      error: true,
      message: await t('Title is required'),
    };
  }

  if (!parentId) {
    return {
      error: true,
      message: await t('Parent is required'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Invalid Tenant'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.resources,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }

  const parent = await fetchFile({
    id: parentId as string,
    workspace,
    user,
    tenantId,
  });

  if (!parent) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const {
    permissionSelect,
    isPrivate,
    partnerSet,
    partnerCategorySet,
    isDirectory,
  } = parent;

  const canModify =
    permissionSelect && [ACTION.WRITE].includes(permissionSelect);

  if (!(isDirectory && canModify)) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const client = await manager.getClient(tenantId);

  try {
    const category = await client.aOSDMSFile
      .create({
        data: {
          fileName: title,
          isDirectory: true,
          workspaceSet: {
            select: [{id: workspace.id}],
          },
          isPrivate,
          permissionSelect,
          description,
          ...(partnerSet?.length
            ? {
                partnerSet: {
                  select: partnerSet.map(({id}: any) => ({id})),
                },
              }
            : {}),
          ...(partnerCategorySet?.length
            ? {
                partnerCategorySet: {
                  select: partnerCategorySet.map(({id}: any) => ({id})),
                },
              }
            : {}),
          ...(parent
            ? {
                parent: {
                  select: {
                    id: Number(parent?.id),
                  },
                },
              }
            : {}),
        },
      })
      .then(clone);

    revalidatePath(`${workspaceURL}/${SUBAPP_CODES.resources}`);

    return {
      success: true,
      data: category,
    };
  } catch (err) {
    return {
      error: true,
      message: 'Error creating category',
    };
  }
}
