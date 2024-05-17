// ---- CORE IMPORTS ---- //
import { clone } from "@/utils";
import { getSession } from "@/orm/auth";
import { DEFAULT_LIMIT } from "@/constants";
import { User } from "@/types";

// ---- LOCAL IMPORTS ---- //
import { findOngoingOrders } from "@/subapps/orders/common/orm/orders";
import Content from "./content";
import { workspacePathname } from "@/utils/workspace";
import { findWorkspace } from "@/orm/workspace";
import { notFound } from "next/navigation";
import { findSubapp } from "@/orm/subapps";
import { getWhereClause } from "@/subapps/orders/common/utils/orders";

export default async function Page({
  params,
  searchParams,
}: {
  params: { tenant: string; workspace: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const { limit, page } = searchParams;
  const session = await getSession();
  const { workspaceURL } = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp("orders", {
    workspace,
    user: session?.user,
  });

  const { isContact, id, mainPartnerId } = session?.user as User;

  if (!app?.installed) {
    return notFound();
  }

  const { role } = app;

  const where = getWhereClause(isContact, role, id, mainPartnerId);

  const { orders, pageInfo } = await findOngoingOrders({
    partnerId: session?.user?.id,
    page,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    where,
  });

  return <Content orders={clone(orders)} pageInfo={pageInfo} />;
}
