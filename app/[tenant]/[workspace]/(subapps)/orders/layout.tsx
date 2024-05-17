import React from "react";
import { notFound } from "next/navigation";

// ---- CORE IMPORTS ---- //
import { findSubapp } from "@/orm/subapps";
import { getSession } from "@/orm/auth";
import { workspacePathname } from "@/utils/workspace";
import { findWorkspace } from "@/orm/workspace";
import { clone } from "@/utils";

export default async function ({
  params,
  children,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) return notFound();

  const { workspaceURL } = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp("orders", { workspace, user: session?.user });

  if (!app?.installed) {
    return notFound();
  }

  return <>{children}</>;
}
