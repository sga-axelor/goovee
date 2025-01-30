'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {getSession} from '@/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {PortalWorkspace} from '@/types';
import {TENANT_HEADER} from '@/middleware';

// ---- LOCAL IMPORTS ---- //
import {findSurveys} from '@/subapps/survey/common/orm/survey';

export const getAllSurveys = async ({
  workspace,
  limit,
}: {
  workspace: PortalWorkspace;
  limit: number;
}) => {
  if (!workspace) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }
  const workspaceURL = workspace?.url;
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Bad Request'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.survey,
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

  const $workspace = await findWorkspace({
    user,
    url: workspace.url,
    tenantId,
  });

  if (!$workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }
  const surveys = await findSurveys({workspace, tenantId, limit});
  return surveys;
};
