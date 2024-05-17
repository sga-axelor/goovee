// ---- CORE IMPORTS ---- //
import { getSession } from "@/orm/auth";
import { findDeliveryAddresses, findInvoicingAddresses } from "@/orm/address";
import type { Partner } from "@/types";
import { clone } from "@/utils";

// ---- LOCAL IMPORTS ---- //
import Content from "./content";

export default async function Addresses() {
  const session = await getSession();

  const deliveryAddresses = await findDeliveryAddresses(
    session?.user?.id as Partner["id"]
  ).then(clone);

  const invoicingAddresses = await findInvoicingAddresses(
    session?.user?.id as Partner["id"]
  ).then(clone);

  return (
    <Content
      invoicingAddresses={invoicingAddresses}
      deliveryAddresses={deliveryAddresses}
    />
  );
}
