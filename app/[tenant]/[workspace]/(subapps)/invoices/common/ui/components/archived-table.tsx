'use client';

import React from 'react';
import {TableCell, TableRow} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils';
import {StyledTable, Tag} from '@/ui/components';
import type {Item} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/invoices/common/utils/invoices';

type ArchivedTableProps = {
  columns: Item[];
  rows: [];
  handleRowClick: (id: string) => void;
};
export const ArchivedTable = ({
  columns,
  rows,
  handleRowClick,
}: ArchivedTableProps) => {
  return (
    <>
      <StyledTable columns={columns}>
        {rows?.map((row: any, index: number) => {
          const {status, variant} = getStatus(row.amountRemaining);
          return (
            <TableRow
              key={index}
              className="pointer"
              onClick={() => handleRowClick(row.id)}>
              <TableCell px={4}>{row.invoiceId}</TableCell>
              <TableCell px={4}>
                <Tag variant={variant}>{status}</Tag>
              </TableCell>
              <TableCell px={4}>{parseDate(row.invoiceDate)}</TableCell>
              <TableCell px={4}>{row.exTaxTotal}</TableCell>
              <TableCell
                fontWeight="bold"
                px={4}
                style={{
                  fontSize: 18,
                }}>
                {row.inTaxTotal}
              </TableCell>
            </TableRow>
          );
        })}
      </StyledTable>
    </>
  );
};

export default ArchivedTable;
