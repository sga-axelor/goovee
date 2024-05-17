"use client";

import React from "react";
import { Box } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import {
  InvoiceTable,
  TableBodyProps,
  TableFooterProps,
  TableHeaderProps,
} from "@/subapps/invoices/common/types/invoices";
import { INVOICE_COLUMNS } from "@/subapps/invoices/common/constants/invoices";

function TableHeader({ columns }: TableHeaderProps) {
  return (
    <>
      {columns.map((column, i) => (
        <Box
          key={i}
          className="header"
          mb={3}
          textTransform="uppercase"
          style={{ color: "#7441C4", fontWeight: 500 }}
          textAlign={i === 0 ? "start" : "end"}
        >
          {column}
        </Box>
      ))}
    </>
  );
}

function TableBody({ invoiceLineList }: TableBodyProps) {
  return invoiceLineList.map(
    ({ productName, price, qty, exTaxTotal }, index) => {
      const showBottomBorder = index !== invoiceLineList.length - 1;
      return (
        <React.Fragment key={index}>
          <Box borderBottom={showBottomBorder} py={2}>
            <Box>{productName}</Box>
          </Box>
          <Box borderBottom={showBottomBorder} py={2} textAlign="end">
            <Box>{price}</Box>
          </Box>
          <Box borderBottom={showBottomBorder} py={2} textAlign="end">
            <Box>{qty}</Box>
          </Box>
          <Box borderBottom={showBottomBorder} py={2} textAlign="end">
            <Box>{exTaxTotal}</Box>
          </Box>
        </React.Fragment>
      );
    }
  );
}

function TableFooter({
  exTaxTotal,
  inTaxTotal,
  taxTotal,
  amountRemaining,
  sumOfDiscounts,
}: TableFooterProps) {
  return (
    <>
      {/* Row 4 */}
      <Box></Box>
      <Box borderBottom py={2} textAlign="end">
        <Box>{i18n.get("Subtotal")}</Box>
        <Box>{i18n.get("Discount")}</Box>
        <Box>{i18n.get("Tax")}</Box>
      </Box>
      <Box borderBottom py={2} textAlign="end">
        <Box>{exTaxTotal}</Box>
        <Box>{sumOfDiscounts}</Box>
        <Box>{taxTotal}</Box>
      </Box>

      {/* Row 5 */}
      <Box></Box>
      <Box
        py={2}
        textAlign="end"
        style={{
          borderBottom: "3px solid #2924BF",
        }}
      >
        <Box>{i18n.get("Total")}</Box>
        <Box>{i18n.get("Deposit Requested")}</Box>
      </Box>
      <Box
        py={2}
        textAlign="end"
        style={{
          borderBottom: "3px solid #2924BF",
        }}
      >
        <Box>{inTaxTotal}</Box>
        <Box>
          {amountRemaining.value} {amountRemaining.symbol}
        </Box>
      </Box>

      {/* Row 6 */}
      <Box></Box>
      <Box py={2} textAlign="end" fontWeight="bold">
        {i18n.get("Deposit Due")}
      </Box>
      <Box py={2} textAlign="end" fontWeight="bold">
        {amountRemaining.value} {amountRemaining.symbol}
      </Box>
    </>
  );
}

export function InvoiceTable({
  invoiceLineList,
  exTaxTotal,
  inTaxTotal,
  amountRemaining,
  taxTotal,
}: InvoiceTable) {
  const sumOfDiscounts = invoiceLineList.reduce((total, { discountAmount }) => {
    return total + parseFloat(discountAmount);
  }, 0);

  return (
    <>
      <Box
        d="grid"
        gridTemplateColumns="2fr 1fr 1fr 1fr"
        lineHeight="lg"
        mb={4}
      >
        <TableHeader columns={INVOICE_COLUMNS} />
        <TableBody invoiceLineList={invoiceLineList} />
      </Box>
      <Box d="grid" gridTemplateColumns="2fr 1fr 1fr " lineHeight="lg">
        <TableFooter
          exTaxTotal={exTaxTotal}
          inTaxTotal={inTaxTotal}
          taxTotal={taxTotal}
          amountRemaining={amountRemaining}
          sumOfDiscounts={sumOfDiscounts}
        />
      </Box>
    </>
  );
}

export default InvoiceTable;
