"use client";

import React from "react";
import { Box, Button, Divider } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { Tag } from "@/ui/components";
import { parseDate } from "@/utils";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { getStatus } from "@/subapps/quotations/common/utils/quotations";
import { QUOTATION_STATUS } from "@/subapps/quotations/common/constants/quotations";
import type { InfoProps } from "@/subapps/quotations/common/types/quotations";
import styles from "./styles.module.scss";

export const Informations = ({
  statusSelect,
  endOfValidityDate,
}: InfoProps) => {
  const { variant, status } = getStatus(statusSelect);
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
            <Box className={styles.text}>{i18n.get("Status")}:</Box>
            <Tag variant={variant}>{status}</Tag>
          </Box>
          <Box d="flex" alignItems="center" gap="0.1rem">
            <Box pe={1} fontSize={6} fontWeight="bold">
              {i18n.get("End of validity")}:
            </Box>
            <Box>{endOfValidityDate ? parseDate(endOfValidityDate) : ""}</Box>
          </Box>
          {statusSelect === QUOTATION_STATUS.CANCELED_QUOTATION && (
            <Box
              d={"flex"}
              flexFlow={{ base: "column-reverse", md: "row" }}
              gap="1rem"
            >
              <Button
                variant="dark"
                outline
                d="flex"
                alignItems="center"
                justifyContent="center"
                mx={3}
                gap="10"
                rounded="pill"
                fontWeight="normal"
              >
                <MaterialIcon icon="download" />
                {i18n.get("Dowload order signed confirmation")}
              </Button>
              <Button
                variant="dark"
                outline
                d="flex"
                alignItems="center"
                justifyContent="center"
                mx={3}
                gap="10"
                rounded="pill"
                fontWeight="normal"
              >
                <MaterialIcon icon="download" /> {i18n.get("Download invoice")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Informations;
