'use server';

import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';
import {headers} from 'next/headers';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';

// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';
import {t} from '@/locale/server';
import {getSession} from '@/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {TENANT_HEADER} from '@/proxy';
import {getFileSizeText} from '@/utils/files';
import {getStoragePath} from '@/storage/index';

// ---- LOCAL IMPORTS ---- //
import {fetchFile} from '@/subapps/resources/common/orm/dms';
import {ACTION} from '@/subapps/resources/common/constants';
import {UploadSchema} from '../common/utils/validators';

const pump = promisify(pipeline);

type FileFormValue = {
  title: string;
  description: string;
  file: File;
};

function extractFileValues(formData: FormData): FileFormValue[] {
  const values: Partial<FileFormValue>[] = [];

  for (const pair of (formData as any).entries()) {
    const key = pair[0] as string;
    const value = pair[1];

    const index = Number(key.match(/\[(\d+)\]/)?.[1]);

    if (Number.isNaN(index)) {
      continue;
    }

    if (!values[index]) {
      values[index] = {};
    }

    const field = key.substring(key.lastIndexOf('[') + 1, key.lastIndexOf(']'));

    if (field === 'title' || field === 'description') {
      values[index][field] = value as string;
    } else if (field === 'file') {
      values[index].file =
        value instanceof File ? value : new File([value], 'filename');
    }
  }

  return values as FileFormValue[];
}

export async function upload(formData: FormData, workspaceURL: string) {
  const parsed = UploadSchema.safeParse({
    workspaceURL,
    parent: formData.get('parent'),
  });
  if (!parsed.success) {
    return {error: true, message: z.prettifyError(parsed.error)};
  }
  const {parent: parentId} = parsed.data;

  const tenantId = (await headers()).get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Invalid Tenant'),
    };
  }

  const tenant = await manager.getTenant(tenantId);
  if (!tenant) return {error: true, message: await t('Invalid tenant')};
  const {client} = tenant;

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
    client,
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
    client,
  });

  if (!workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }

  const parent = await fetchFile({
    id: parentId,
    workspaceURL,
    user,
    client,
  });

  if (!parent) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const {
    permissionSelect,
    partnerSet,
    partnerCategorySet,
    isDirectory,
    isPrivate,
  } = parent;

  const canModify =
    permissionSelect === ACTION.WRITE || permissionSelect === ACTION.UPLOAD;

  if (!(isDirectory && canModify)) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const values = extractFileValues(formData);

  const getTimestampFilename = (name: string) => {
    return `${new Date().getTime()}-${name}`;
  };

  type FileEntry = {
    name: string;
    timestampFilename: string;
    file: File;
    description: string;
  };

  try {
    const fileEntries: FileEntry[] = await Promise.all(
      values.map(async ({title, description, file}) => {
        const titleWithExt = `${title}${path.extname(file.name)}`;
        const name = titleWithExt || file.name;
        const timestampFilename = getTimestampFilename(name);
        await pump(
          file.stream(),
          fs.createWriteStream(
            path.resolve(getStoragePath(), timestampFilename),
          ),
        );
        return {name, timestampFilename, file, description};
      }),
    );

    const timestamp = new Date();
    await client.aOSDMSFile.createAll({
      data: fileEntries.map(({name, timestampFilename, file, description}) => ({
        fileName: name,
        isDirectory: false,
        parent: {select: {id: Number(parent.id)}},
        createdOn: timestamp,
        updatedOn: timestamp,
        workspaceSet: {
          select: [{url: workspaceURL}],
        },
        isPrivate,
        permissionSelect,
        ...(partnerSet?.length
          ? {partnerSet: {select: partnerSet.map(({id}) => ({id}))}}
          : {}),
        ...(partnerCategorySet?.length
          ? {
              partnerCategorySet: {
                select: partnerCategorySet.map(({id}) => ({id})),
              },
            }
          : {}),
        metaFile: {
          create: {
            fileName: name,
            filePath: timestampFilename,
            fileType: file.type,
            fileSize: String(file.size),
            sizeText: getFileSizeText(file.size),
            description: description,
            createdOn: timestamp,
            updatedOn: timestamp,
          },
        },
      })),
      select: {id: true},
    });

    revalidatePath(`${workspaceURL}/${SUBAPP_CODES.resources}/categories`);
  } catch (err) {
    return {
      error: true,
    };
  }

  return {
    success: true,
  };
}
