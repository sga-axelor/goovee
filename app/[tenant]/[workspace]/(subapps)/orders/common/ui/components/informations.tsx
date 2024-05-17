"use client";

import React from "react";
import { Box, Button, Divider } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { Tag } from "@/ui/components";
import { parseDate } from "@/utils";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { ORDER_TYPE } from "@/subapps/orders/common/constants/orders";

export const Informations = ({
  createdOn,
  shipmentMode,
  status,
  variant,
}: any) => {
  const showShippingLink = [ORDER_TYPE.SHIPPED, ORDER_TYPE.DELIVERED].includes(
    status
  );
  return (
    <>
      <Box
        bg="white"
        d={{ base: "flex", md: "block" }}
        flexDirection="column"
        rounded={3}
        p={{ base: 3, md: 4 }}
      >
        <Box as="h2">{i18n.get("Informations")}</Box>
        <Divider />
        <Box d="flex" flexDirection="column" gap="1rem">
          <Box d="flex" alignItems="center" gap="1rem">
            <Box style={{ fontSize: 18, fontWeight: 600 }}>
              {i18n.get("Status")}:
            </Box>
            <Tag variant={variant}>{status}</Tag>
            <Box></Box>
          </Box>
          <Box d="flex" alignItems="center" gap="0.1rem">
            <Box pe={1} style={{ fontSize: 18, fontWeight: 600 }}>
              {i18n.get("Created on")}:
            </Box>
            <Box>{parseDate(createdOn)}</Box>
          </Box>
          <Box d="flex" alignItems="center" gap="0.1rem">
            <Box pe={1} style={{ fontSize: 18, fontWeight: 600 }}>
              {i18n.get("Shipping method")}:
            </Box>
            <Box>{shipmentMode?.name}</Box>
          </Box>
          {showShippingLink && (
            <Box d="flex" alignItems="center" gap="0.1rem">
              <Box textDecoration="underline" style={{ color: "#2D60C4" }}>
                {i18n.get("Shipping link to follow the delivery path")}
              </Box>
            </Box>
          )}
          <Box d="flex">
            <Button
              variant="dark"
              outline
              d="flex"
              alignItems="center"
              justifyContent="center"
              gap="10"
              rounded="pill"
              flexBasis={{ base: "100%", md: "fit-content" }}
            >
              <MaterialIcon icon="download" /> {i18n.get("Download bill")}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Informations;
