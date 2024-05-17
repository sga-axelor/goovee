"use server";

// ---- CORE IMPORTS ---- //
import { getSession } from "@/orm/auth";
import { clone } from "@/utils";
import { DEFAULT_LIMIT, ROLE } from "@/constants";
import { User } from "@/types";

// ---- LOCAL IMPORTS ---- //
import Content from "./content";
import { fetchQuotations } from "@/subapps/quotations/common/orm/quotations";
import { workspacePathname } from "@/utils/workspace";
import { findWorkspace } from "@/orm/workspace";
import { notFound } from "next/navigation";
import { findSubapp } from "@/orm/subapps";
import { getWhereClause } from "@/subapps/quotations/common/utils/quotations";

export default async function Page({
  params,
  searchParams,
}: {
  params: { tenant: string; workspace: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getSession();
  const { limit, page } = searchParams;

  const { workspaceURL } = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp("quotations", {
    workspace,
    user: session?.user,
  });

  if (!app?.installed) {
    return notFound();
  }

  const { isContact, id, mainPartnerId } = session?.user as User;
  const { role } = app;

  const where = getWhereClause(isContact, role, id, mainPartnerId);

  const { quotations, pageInfo } = await fetchQuotations({
    page: page || 1,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    partnerId: id,
    where,
  });
  return <Content quotations={clone(quotations)} pageInfo={pageInfo} />;
}
