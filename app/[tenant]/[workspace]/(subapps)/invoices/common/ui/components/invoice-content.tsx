"use client";

import { Box } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { parseDate } from "@/utils";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { InvoiceTable } from ".";

export function InvoiceContent({ invoice }: { invoice: any }) {
  const {
    invoiceId,
    dueDate,
    invoiceDate,
    amountRemaining,
    note,
    invoiceLineList,
    exTaxTotal,
    inTaxTotal,
    taxTotal,
    company,
    partner,
    paymentCondition,
  } = invoice;

  const {
    address: {
      addressl4,
      addressl6,
      addressl7country: { name: countryName },
      zip,
    },
    name,
  } = company;
  const companyPartnerNumber = company.partner.fixedPhone.replace(/\./g, "-");
  const companyCityName = addressl6.split(" ").pop();
  const { simpleFullName, mainAddress } = partner;
  const partnerNumber = partner.fixedPhone.replace(/\./g, "-");
  const partnerCityName = mainAddress.addressl6.split(" ").pop();

  return (
    <>
      <Box border py={1}>
        <Box rounded border shadow px={5} py={5}>
          <Box d="flex" justifyContent="space-between" mb={5}>
            <Box style={{ fontSize: 48 }} textTransform="uppercase">
              {i18n.get("Invoice")}
            </Box>
            <Box textAlign="end">
              <Box fontWeight="bold">{name}</Box>
              <Box>{addressl4}</Box>
              <Box>{companyCityName}</Box>
              <Box>{zip}</Box>
              <Box>{countryName}</Box>
              <Box>{companyPartnerNumber}</Box>
            </Box>
          </Box>
          <Box
            d="flex"
            w={100}
            gap="3rem"
            mb={4}
            style={{
              paddingBottom: "4rem",
              borderBottom: "3px solid #2924BF",
            }}
          >
            <Box flex="1">
              <Box style={{ color: "#7441C4", fontWeight: 500 }}>
                {i18n.get("Billed To")}
              </Box>
              <Box>{simpleFullName}</Box>
              <Box>{mainAddress.addressl4}</Box>
              <Box>{partnerCityName}</Box>
              <Box>{mainAddress.zip}</Box>
              <Box>{mainAddress.addressl7country.name}</Box>
              <Box>{partnerNumber}</Box>
            </Box>
            <Box flex="1" d="flex" flexDirection="column" gap="2rem">
              <Box d="flex" justifyContent="space-between">
                <Box>
                  <Box style={{ color: "#7441C4", fontWeight: 500 }}>
                    {i18n.get("Date Issued")}
                  </Box>
                  <Box>{parseDate(invoiceDate)}</Box>
                </Box>
                <Box>
                  <Box style={{ color: "#7441C4", fontWeight: 500 }}>
                    {i18n.get("Invoice Number")}
                  </Box>
                  <Box>{invoiceId}</Box>
                </Box>
                <Box>
                  <Box style={{ color: "#7441C4", fontWeight: 500 }}>
                    {i18n.get("Amount Due")}
                  </Box>
                  <Box fontWeight="bold">
                    {amountRemaining.value} {amountRemaining.symbol}
                  </Box>
                </Box>
              </Box>
              <Box d="flex">
                <Box>
                  <Box style={{ color: "#7441C4", fontWeight: 500 }}>
                    {i18n.get("Due Date")}
                  </Box>
                  <Box>{parseDate(dueDate)}</Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box mb={3}>
            <InvoiceTable
              invoiceLineList={invoiceLineList}
              exTaxTotal={exTaxTotal}
              inTaxTotal={inTaxTotal}
              amountRemaining={amountRemaining}
              taxTotal={taxTotal}
            />
          </Box>
          <Box mb={3}>
            <Box style={{ color: "#7441C4", fontWeight: 500 }}>
              {i18n.get("Notes")}
            </Box>
            <Box>{note}</Box>
          </Box>
          <Box>
            <Box style={{ color: "#7441C4", fontWeight: 500 }}>
              {i18n.get("Terms")}
            </Box>
            <Box>{paymentCondition.name}</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default InvoiceContent;
