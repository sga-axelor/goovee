// ---- CORE IMPORTS ---- //
import { clone } from "@/utils";

// ---- LOCAL IMPORTS ---- //
import { findOrder } from "@/subapps/orders/common/orm/orders";
import Content from "./content";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const order = await findOrder(id);

  return <Content order={clone(order)} />;
}
