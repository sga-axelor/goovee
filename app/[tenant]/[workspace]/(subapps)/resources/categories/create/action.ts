'use server';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace, findSubappAccess} from '@/orm/workspace';
import {clone} from '@/utils';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {fetchSharedFolders} from '@/subapps/resources/common/orm/dms';

export async function create(formData: FormData, workspaceURL: string) {
  const title = formData.get('title') as string;
  const description = formData.get('description')!;
  const icon = formData.get('icon')!;
  const parent = formData.get('parent')!;
  const color = formData.get('color')!;

  if (!workspaceURL) {
    return {
      error: true,
      message: i18n.get('Workspace not provided.'),
    };
  }

  if (!title) {
    return {
      error: true,
      message: i18n.get('Title is required'),
    };
  }

  if (!parent) {
    return {
      error: true,
      message: i18n.get('Parent category is required'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.resources,
    user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  const isSharedParent = (
    await fetchSharedFolders({
      workspace,
      params: {
        where: {
          id: parent,
        },
      },
    })
  )?.length;

  if (!isSharedParent) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const client = await getClient();

  try {
    const category = await client.aOSDMSFile
      .create({
        data: {
          fileName: title,
          isDirectory: true,
          isSharedFolder: true,
          workspaceSet: {
            select: [{id: workspace.id}],
          },
          ...(parent
            ? {
                parent: {
                  select: {
                    id: Number(parent),
                  },
                },
              }
            : {}),
        },
      })
      .then(clone);

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
