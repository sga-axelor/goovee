// ---- CORE IMPORTS ---- //
import { clone } from "@/utils";
import { getSession } from "@/orm/auth";
import { notFound } from "next/navigation";

// ---- LOCAL IMPORTS ---- //
import Content from "./content";
import { findUnpaidInvoices } from "@/subapps/invoices/common/orm/invoices";
import { workspacePathname } from "@/utils/workspace";
import { findWorkspace } from "@/orm/workspace";
import { findSubapp } from "@/orm/subapps";
import { getWhereClause } from "@/subapps/invoices/common/utils/invoices";

export default async function Invoices({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
}) {
  const session = await getSession();

  if (!session) return notFound();

  const { workspaceURL } = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp("invoices", { workspace, user: session?.user });

  const { id, isContact, mainPartnerId } = session?.user;

  if (!app?.installed) {
    return notFound();
  }

  const { role } = app;

  const where = getWhereClause(isContact, role, mainPartnerId, id);

  const invoices = await findUnpaidInvoices({ where });

  return <Content invoices={clone(invoices)} />;
}
