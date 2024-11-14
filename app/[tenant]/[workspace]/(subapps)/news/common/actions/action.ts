'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {ORDER_BY, SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {TENANT_HEADER} from '@/middleware';
import {type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findNews} from '@/subapps/news/common/orm/news';
import {DEFAULT_RECOMMENDED_NEWS_LIMIT} from '@/subapps/news/common/constants';

export async function findSearchNews({workspaceURL}: {workspaceURL: string}) {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await getTranslation('Bad Request'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.news,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
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
      message: await getTranslation('Invalid workspace'),
    };
  }

  const {news} = await findNews({workspace, tenantId, user}).then(clone);

  return news;
}

export async function findRecommendedNews({
  workspace,
  tenantId,
  categoryIds,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  categoryIds: string[];
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: getTranslation('Unauthorized'),
    };
  }

  if (!tenantId) {
    return {
      error: true,
      message: getTranslation('Bad Request'),
    };
  }

  if (!workspace) {
    return {
      error: true,
      message: getTranslation('Invalid workspace'),
    };
  }

  const {news} = await findNews({
    workspace,
    tenantId,
    limit: DEFAULT_RECOMMENDED_NEWS_LIMIT,
    orderBy: {
      publicationDateTime: ORDER_BY.DESC,
    },
    categoryIds,
  }).then(clone);
  return news;
}
