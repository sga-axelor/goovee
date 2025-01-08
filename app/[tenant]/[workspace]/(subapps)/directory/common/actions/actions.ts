'use server';
import {headers} from 'next/headers';
import type {ID} from '@goovee/orm';
import {ActionResponse} from '@/types/action';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {getSession} from '@/lib/core/auth';
import {t} from '@/lib/core/locale/server';
import {TENANT_HEADER} from '@/middleware';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import type {Cloned} from '@/types/util';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {findEntriesBySearch} from '../orm';
import type {SearchEntry} from '../types';

export async function searchEntries({
  search,
  workspaceURL,
  categoryId,
}: {
  search?: string;
  workspaceURL: string;
  categoryId?: ID;
}): ActionResponse<Cloned<SearchEntry>[]> {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }
  const session = await getSession();

  // TODO: check if user auth is required
  // if (!session?.user) {
  //   return {
  //     error: true,
  //     message: await t('User not found.'),
  //   };
  // }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await t('Workspace not found.'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.directory,
    user: session?.user,
    url: workspaceURL,
    tenantId,
  });
  if (!subapp) {
    return {
      error: true,
      message: await t('Subapp not found.'),
    };
  }

  try {
    const entries = await findEntriesBySearch({
      search,
      workspaceId: workspace.id,
      tenantId,
      categoryId,
    });

    return {success: true, data: clone(entries)};
  } catch (e) {
    if (e instanceof Error) {
      return {error: true, message: e.message};
    }
    throw e;
  }
}
