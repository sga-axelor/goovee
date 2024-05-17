"use client";

import React from "react";
import { Box, Button, TableCell, TableRow } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { parseDate } from "@/utils";
import { StyledTable, Tag } from "@/ui/components";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import type {
  Quotations,
  QuotationsTableProps,
} from "@/subapps/quotations/common/types/quotations";
import { getStatus } from "@/subapps/quotations/common/utils/quotations";
import { QUOTATION_STATUS } from "@/subapps/quotations/common/constants/quotations";
import styles from "./styles.module.scss";

export const QuotationsTable = ({
  columns,
  quotations,
  onClick,
}: QuotationsTableProps) => {
  return (
    <>
      <Box>
        <StyledTable columns={columns}>
          {quotations?.map((quotation: Quotations) => {
            const { status, variant } = getStatus(quotation.statusSelect);
            return (
              <TableRow
                key={quotation.id}
                className={styles["table-row"]}
                onClick={() => onClick(quotation.id)}
              >
                <TableCell
                  className={styles["table-cell"]}
                  fontWeight="bold"
                  py={3}
                  px={4}
                >
                  {i18n.get("Sale quotation")} {quotation.saleOrderSeq}
                  {quotation.externalReference &&
                    ` ( ${quotation.externalReference} )`}
                </TableCell>
                <TableCell className={styles["table-cell"]} py={3} px={4}>
                  <Tag variant={variant}>{status}</Tag>
                </TableCell>
                <TableCell className={styles["table-cell"]} py={3} px={4}>
                  {parseDate(quotation.createdOn)}
                </TableCell>
                <TableCell className={styles["table-cell"]} py={3} px={4}>
                  {quotation?.statusSelect ===
                    QUOTATION_STATUS.FINALISED_QUOTATION && (
                    <Button
                      variant="dark"
                      outline
                      d="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap="10"
                      rounded="pill"
                      w={100}
                    >
                      {i18n.get("Give a reponse")}{" "}
                      <MaterialIcon icon="arrow_right_alt" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </StyledTable>
      </Box>
    </>
  );
};

export default QuotationsTable;
