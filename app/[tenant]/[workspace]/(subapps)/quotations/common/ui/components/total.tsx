"use client";

import React from "react";
import { Box, Button, Divider } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { QUOTATION_STATUS } from "@/subapps/quotations/common/constants/quotations";
import type { TotalProps } from "@/subapps/quotations/common/types/quotations";
import styles from "./styles.module.scss";

export const Total = ({
  exTaxTotal,
  inTaxTotal,
  totalDiscount,
  statusSelect,
}: TotalProps) => {
  return (
    <>
      <Box
        d="flex"
        flexDirection="column"
        bg="white"
        px={4}
        py={3}
        rounded={2}
        borderColor="black"
        border
      >
        <Box fontSize={2} fontWeight="normal">
          {i18n.get("Offered price")}
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
              <Box>{totalDiscount}%</Box>
            </Box>
          </Box>

          <Box d="flex" alignItems="center" justifyContent="space-between">
            <Box fontWeight="bold">{i18n.get("Total price")}:</Box>
            <Box fontWeight="bolder" fontSize={4}>
              {inTaxTotal}
            </Box>
          </Box>

          {statusSelect !== QUOTATION_STATUS.CANCELED_QUOTATION && (
            <>
              <Box d="flex" justifyContent="center">
                <Button
                  d="flex"
                  w={100}
                  alignItems="center"
                  justifyContent="center"
                  gap="10"
                  rounded="pill"
                  className={styles.success}
                >
                  <MaterialIcon icon="check_circle" />
                  {i18n.get("Accept and sign")}
                </Button>
              </Box>
              <Box d="flex" justifyContent="center">
                <Button
                  variant="danger"
                  d="flex"
                  w={100}
                  fontWeight="normal"
                  alignItems="center"
                  justifyContent="center"
                  gap="10"
                  rounded="pill"
                  className={styles.danger}
                >
                  <MaterialIcon icon="disabled_by_default" />
                  {i18n.get("Reject")}
                </Button>
              </Box>
            </>
          )}

          {false && (
            <Box d="flex" justifyContent="center">
              <Button
                variant="dark"
                w={100}
                fontWeight="normal"
                d="flex"
                alignItems="center"
                justifyContent="center"
                gap="10"
                rounded="pill"
              >
                {i18n.get("Pay")} <MaterialIcon icon="arrow_right_alt" />
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Total;
