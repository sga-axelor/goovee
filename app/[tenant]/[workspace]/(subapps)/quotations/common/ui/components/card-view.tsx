"use client";

import React from "react";
import { Box, Button } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { Tag } from "@/ui/components";
import { parseDate } from "@/utils";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { getStatus } from "@/subapps/quotations/common/utils/quotations";
import { QUOTATION_STATUS } from "@/subapps/quotations/common/constants/quotations";
import type {
  Quotations,
  CardViewProps,
} from "@/subapps/quotations/common/types/quotations";
import styles from "./styles.module.scss";

export const Card = ({ quotations, onClick }: CardViewProps) => {
  return (
    <>
      {quotations?.map((quotation: Quotations, i: number) => {
        const { status, variant } = getStatus(quotation.statusSelect);
        return (
          <Box
            key={quotation.id}
            rounded
            bg="white"
            px={3}
            py={4}
            d="flex"
            flexDirection="column"
            gap="1rem"
            border
            className={styles["card-wrapper"]}
            onClick={() => onClick(quotation.id)}
          >
            <Box
              d="flex"
              alignItems="center"
              justifyContent="space-between"
              fontWeight="bold"
            >
              <Box>{i18n.get("Quotation number")}</Box>
              <Box>{quotation.saleOrderSeq}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box fontWeight="bold">{i18n.get("Status")}</Box>
              <Box>
                <Tag variant={variant}>{status}</Tag>
              </Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box fontWeight="bold">{i18n.get("Created on")}</Box>
              <Box>{parseDate(quotation.createdOn)}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              {quotation?.statusSelect ===
                QUOTATION_STATUS.FINALISED_QUOTATION && (
                <Button
                  variant="dark"
                  outline
                  w={100}
                  d="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="10"
                  rounded="pill"
                >
                  {i18n.get("Give a reponse")}
                  <MaterialIcon icon="arrow_right_alt" />
                </Button>
              )}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default Card;
