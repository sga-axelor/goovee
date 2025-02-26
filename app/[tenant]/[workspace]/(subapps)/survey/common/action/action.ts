'use server';

import {headers} from 'next/headers';
import {manager} from '@/tenant';

// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {getSession} from '@/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {PortalWorkspace} from '@/types';
import {TENANT_HEADER} from '@/middleware';

// ---- LOCAL IMPORTS ---- //
import {findSurveys} from '@/subapps/survey/common/orm/survey';
import {AuthResponse} from '@/subapps/survey/common/types';

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
      message: await t('Bad request'),
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

export const authenticateUser = async ({
  workspace,
}: {
  workspace: PortalWorkspace;
}): Promise<AuthResponse> => {
  if (!workspace) {
    return {
      error: true,
      message: await t('Missing workspace'),
    };
  }

  const workspaceURL = workspace?.url;
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: await t('User not found'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Missing tenant ID'),
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
      message: await t('Unauthorized app access'),
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

  try {
    const tenant = await manager.getTenant(tenantId);
    if (!tenant?.config?.aos?.url) {
      return {
        error: true,
        message: await t('Missing AOS URL'),
      };
    }

    const {url, auth} = tenant.config.aos;
    return {url, username: auth.username, password: auth.password};
  } catch (error) {
    console.error('Auth Config Error:', error);
    return {
      error: true,
      message: await t('Authentication failed'),
    };
  }
};
