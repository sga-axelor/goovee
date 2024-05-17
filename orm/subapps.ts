// ---- CORE IMPORTS ---- //
import { findWorkspaceApps } from "@/orm/workspace";
import { clone } from "@/utils";
import type { PortalWorkspace, User } from "@/types";

export async function findSubapp(
  code: string,
  {
    workspace,
    user,
  }: {
    workspace?: PortalWorkspace;
    user?: User;
  } = {}
) {
  const subapps = await findSubapps({ workspace, user });

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
    .then((subapps) =>
      subapps.map((app: any) => ({
        ...app,
        installed: app?.installed === "yes",
      }))
    );

  return apps;
}
