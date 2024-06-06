'use client';

import React from 'react';
import {Button} from '@axelor/ui';
import {TableCell, TableRow} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils';
import {StyledTable, Tag} from '@/ui/components';
import type {Item} from '@/types';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {INVOICE_TYPE} from '@/subapps/invoices/common/constants/invoices';

type UnpaidTableProps = {
  columns: Item[];
  rows: [];
  handleRowClick: (id: string) => void;
};

export const UnpaidTable = ({
  columns,
  rows,
  handleRowClick,
}: UnpaidTableProps) => {
  return (
    <>
      <StyledTable columns={columns}>
        {rows?.map((row: any, index: number) => {
          return (
            <TableRow
              className="pointer"
              key={index}
              onClick={() => handleRowClick(row.id)}>
              <TableCell px={4}>{row.invoiceId}</TableCell>
              <TableCell px={4}>
                <Tag variant="error">{i18n.get(INVOICE_TYPE.UNPAID)}</Tag>
              </TableCell>
              <TableCell px={4}>{parseDate(row.dueDate)}</TableCell>
              <TableCell px={4}>{row.exTaxTotal}</TableCell>
              <TableCell
                fontWeight="bold"
                px={4}
                style={{
                  fontSize: 18,
                }}>
                {row.inTaxTotal}
              </TableCell>
              <TableCell px={4}>
                <Button
                  variant="dark"
                  d="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="10"
                  w={100}
                  rounded="pill">
                  {i18n.get('Pay')} <MaterialIcon icon="east" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </StyledTable>
    </>
  );
};

export default UnpaidTable;
