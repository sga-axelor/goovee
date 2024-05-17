"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { Container, NavView } from "@/ui/components";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import {
  ARCHIVED_INVOICE_COLUMNS,
  ITEMS,
} from "@/subapps/invoices/common/constants/invoices";
import { Card, ArchivedTable } from "@/subapps/invoices/common/ui/components";

type ContentProps = {
  invoices: [];
  pageInfo?: any;
};

export default function Content({ invoices = [] }: ContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = () => {
    router.push(`unpaid`);
  };

  const handleClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  return (
    <>
      <Container title={i18n.get("Invoices")}>
        <NavView items={ITEMS} activeTab="2" onTabChange={handleTabChange}>
          <Box d={{ base: "none", md: "block" }}>
            <ArchivedTable
              columns={ARCHIVED_INVOICE_COLUMNS}
              rows={invoices}
              handleRowClick={handleClick}
            />
          </Box>
          <Box d={{ base: "block", md: "none" }}>
            <Card invoices={invoices} handleRowClick={handleClick} />
          </Box>
        </NavView>
      </Container>
    </>
  );
}
