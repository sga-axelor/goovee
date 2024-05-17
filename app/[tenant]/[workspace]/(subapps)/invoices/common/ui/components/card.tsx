"use client";

import React from "react";
import { Box, Button } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { parseDate } from "@/utils";
import { Tag } from "@/ui/components";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { getStatus } from "@/subapps/invoices/common/utils/invoices";

export const Card = ({
  invoices,
  handleRowClick,
}: {
  invoices: [];
  handleRowClick: (id: string) => void;
}) => {
  return (
    <>
      <Box d={{ base: "block", md: "none" }}>
        {invoices?.map((invoice: any, i: number) => {
          const { status, variant } = getStatus(invoice.amountRemaining);
          return (
            <Box
              key={i}
              rounded
              bg="white"
              px={3}
              py={4}
              d="flex"
              flexDirection="column"
              gap="1rem"
              border
              style={{ borderColor: "#E6E7E7 !important", cursor: "pointer" }}
              onClick={() => handleRowClick(invoice.id)}
            >
              <Box
                d="flex"
                alignItems="center"
                justifyContent="space-between"
                style={{ fontWeight: "bold" }}
              >
                <Box>{i18n.get("Invoice number")}</Box>
                <Box>{invoice.invoiceId}</Box>
              </Box>
              <Box d="flex" alignItems="center" justifyContent="space-between">
                <Box style={{ fontWeight: "bold" }}>{i18n.get("Status")}</Box>
                <Box>
                  <Tag variant={variant}>{status}</Tag>
                </Box>
              </Box>
              <Box d="flex" alignItems="center" justifyContent="space-between">
                <Box style={{ fontWeight: "bold" }}>
                  {i18n.get("Created on")}
                </Box>
                <Box>{parseDate(invoice.dueDate)}</Box>
              </Box>
              <Box d="flex" alignItems="center" justifyContent="space-between">
                <Box style={{ fontWeight: "bold" }}>{i18n.get("Total WT")}</Box>
                <Box> {invoice.exTaxTotal}</Box>
              </Box>
              <Box d="flex" alignItems="center" justifyContent="space-between">
                <Box style={{ fontWeight: "bold" }}>
                  {i18n.get("Total ATI")}
                </Box>
                <Box style={{ fontSize: 18, fontWeight: "bold" }}>
                  {invoice.inTaxTotal}
                </Box>
              </Box>
              <Box>
                <Button
                  variant="dark"
                  d="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="10"
                  w={100}
                  rounded="pill"
                >
                  {i18n.get("Pay")} <MaterialIcon icon="east" />
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default Card;
