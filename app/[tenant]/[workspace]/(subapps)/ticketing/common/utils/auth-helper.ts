import {getSession} from '@/auth';
import {SUBAPP_CODES} from '@/constants';
import {AOSPortalTheme} from '@/goovee/.generated/models';
import {t} from '@/locale/server';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {Tenant} from '@/tenant';
import {User} from '@/types';
import {Maybe} from '@/types/util';
import type {ID} from '@goovee/orm';
import {cache} from 'react';

export type UserAuthProps = {
  userId: ID;
  simpleFullName: string;
  isContact: boolean;
  isContactAdmin: boolean;
  role?: 'total' | 'restricted';
};

export type WorkspaceAuthProps = {workspaceId: string};
export type TenantAuthProps = {tenantId: Tenant['id']};
export type AuthProps = UserAuthProps & WorkspaceAuthProps & TenantAuthProps;

export const ensureAuth = cache(async function ensureAuth(
  workspaceURL: Maybe<string>,
  tenantId: Tenant['id'],
): Promise<
  | {error: true; message: string; info?: never}
  | {
      error: false;
      message?: never;
      info: {
        auth: AuthProps;
        user: User;
        subapp: any;
        workspace: {
          id: string;
          name: string | undefined;
          version: number;
          theme: AOSPortalTheme | undefined;
          url: string;
          config: any;
          apps: any[];
          navigationSelect: string;
        };
      };
    }
> {
  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Workspace not provided.'),
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
    code: SUBAPP_CODES.ticketing,
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

  return {
    error: false,
    info: {
      user,
      subapp,
      workspace,
      auth: {
        userId: user.id,
        simpleFullName: user.simpleFullName,
        workspaceId: workspace.id,
        isContact: user.isContact!,
        tenantId,
        role: subapp.role,
        isContactAdmin: subapp.isContactAdmin,
      },
    },
  };
});
