// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {findWorkspace, findWorkspaceApps} from '@/orm/workspace';
import type {PortalWorkspace, User} from '@/types';

export async function findSubapp(
  code: string,
  {
    workspace,
    user,
  }: {
    workspace?: PortalWorkspace;
    user?: User;
  } = {},
) {
  const subapps = await findSubapps({workspace, user});

  return subapps.find((app: any) => app.code === code);
}

export async function findSubapps({
  workspace,
  user,
}: {
  workspace?: PortalWorkspace;
  user?: User;
}) {
  const apps = findWorkspaceApps({
    workspace,
    user,
  })
    .then(clone)
    .then(subapps =>
      subapps.map((app: any) => ({
        ...app,
        installed: app?.installed === 'yes',
      })),
    );

  return apps;
}

export async function findSubappAccess({
  code,
  user,
  workspaceURL,
}: {
  code: string;
  user: any;
  workspaceURL: string;
}) {
  if (!(code && user && workspaceURL)) return null;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return null;

  const subapp = await findSubapp(code, {workspace, user});

  if (!subapp?.installed) return null;

  return subapp
}
