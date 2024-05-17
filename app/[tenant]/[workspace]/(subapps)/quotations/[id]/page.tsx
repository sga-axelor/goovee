import React from "react";

// ---- CORE IMPORTS ---- //
import { clone } from "@/utils";

// ---- LOCAL IMPORTS ---- //
import Content from "./content";
import {
  findQuotation,
  getComments,
} from "@/subapps/quotations/common/orm/quotations";

type PageProps = {
  params: {
    id: any;
  };
};
export default async function Page({ params }: PageProps) {
  const { id } = params;
  const quotation = await findQuotation(id);
  const comments = await getComments(id);

  return <Content quotation={clone(quotation)} comments={clone(comments)} />;
}
