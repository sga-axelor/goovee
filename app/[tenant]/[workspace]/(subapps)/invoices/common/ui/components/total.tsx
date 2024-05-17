"use client";

import React from "react";
import { Box, Button, Divider } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { DEFAULT_CURRENCY_SCALE } from "@/constants";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { TotalProps } from "@/subapps/invoices/common/types/invoices";

export function Total({
  exTaxTotal,
  inTaxTotal,
  invoiceLineList,
  numberOfDecimals,
}: TotalProps) {
  const sumOfDiscounts: number = invoiceLineList.reduce(
    (total, { discountAmount }) => {
      return total + parseFloat(discountAmount);
    },
    0
  );

  const discount =
    sumOfDiscounts === 0
      ? 0
      : ((100 * sumOfDiscounts) / (sumOfDiscounts + +exTaxTotal)).toFixed(
          numberOfDecimals || DEFAULT_CURRENCY_SCALE
        );

  return (
    <>
      <Box
        flexBasis={{ base: "100%", md: "25%" }}
        d="flex"
        flexDirection="column"
        bg="white"
        px={4}
        py={3}
        border
        rounded={2}
        borderColor="dark"
        style={{ height: "fit-content" }}
      >
        <Box fontSize={2} style={{ fontWeight: 500 }}>
          {i18n.get("Total")}
        </Box>
        <Divider />

        <Box d="flex" flexDirection="column" gap="1rem" mb={2}>
          <Box d="flex" flexDirection="column" gap={"0.5rem"}>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box>{i18n.get("Total WT")}:</Box>
              <Box>{exTaxTotal}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box>{i18n.get("Total ATI")}:</Box>
              <Box>{inTaxTotal}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box>{i18n.get("Discount")}:</Box>
              <Box>{discount}%</Box>
            </Box>
          </Box>

          <Box d="flex" alignItems="center" justifyContent="space-between">
            <Box fontWeight="bold">{i18n.get("Total price")}:</Box>
            <Box fontWeight="bolder" fontSize={4}>
              {inTaxTotal}
            </Box>
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
    </>
  );
}
export default Total;
