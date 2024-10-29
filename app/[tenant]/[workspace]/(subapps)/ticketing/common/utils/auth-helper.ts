import {SUBAPP_CODES} from '@/constants';
import {AOSPortalTheme} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {User} from '@/types';
import {Maybe} from '@/types/util';

export async function ensureAuth(workspaceURL: Maybe<string>): Promise<
  | {error: true; message: string; auth?: never}
  | {
      error: false;
      message?: never;
      auth: {
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
      message: i18n.get('Workspace not provided.'),
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
    code: SUBAPP_CODES.ticketing,
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

  return {
    error: false,
    auth: {user, subapp, workspace},
  };
}
