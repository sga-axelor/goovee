"use client";

import React from "react";
import { Box } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { Container } from "@/ui/components";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import {
  Contact,
  ContactUs,
  History,
  Informations,
  Total,
} from "@/subapps/orders/common/ui/components";
import { getStatus } from "@/subapps/orders/common/utils/orders";
import { ORDER_TYPE } from "@/subapps/orders/common/constants/orders";

const Content = ({ order }: { order: any }) => {
  const {
    saleOrderSeq,
    exTaxTotal,
    inTaxTotal,
    createdOn,
    shipmentMode,
    statusSelect,
    deliveryState,
    clientPartner,
    mainInvoicingAddress,
    deliveryAddress,
    company,
    saleOrderLineList,
    totalDiscount,
  } = order;

  const { status, variant } = getStatus(statusSelect, deliveryState);

  const showContactUs = ![ORDER_TYPE.CLOSED].includes(status);

  return (
    <>
      <Container title={`${i18n.get("Order number")} ${saleOrderSeq}`}>
        <Informations
          createdOn={createdOn}
          shipmentMode={shipmentMode}
          status={status}
          variant={variant}
        />

        <Box
          d={"flex"}
          flexFlow={{ base: "column-reverse", md: "row" }}
          gap="1rem"
        >
          <Box
            d="flex"
            flexDirection="column"
            gap="1.5rem"
            flexBasis={{
              base: "100%",
              md: "75%",
            }}
          >
            <Contact
              clientPartner={clientPartner}
              company={company}
              mainInvoicingAddress={mainInvoicingAddress}
              deliveryAddress={deliveryAddress}
              saleOrderLineList={saleOrderLineList}
            />
            {false && <History />}
            {showContactUs && <ContactUs />}
          </Box>
          <Total
            exTaxTotal={exTaxTotal}
            inTaxTotal={inTaxTotal}
            totalDiscount={totalDiscount}
          />
        </Box>
      </Container>
    </>
  );
};

export default Content;
