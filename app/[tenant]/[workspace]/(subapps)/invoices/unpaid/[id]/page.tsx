// ---- CORE IMPORTS ---- //
import { clone } from "@/utils";

// ---- LOCAL IMPORTS ---- //
import Content from "./content";
import { findInvoice } from "@/subapps/invoices/common/orm/invoices";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const invoice = await findInvoice(id);

  return <Content invoice={clone(invoice)} />;
}
