'use client';
import React from 'react';
import {MdEast} from 'react-icons/md';
import {Button} from '@ui/components/button';
import {TableCell, TableRow} from '@ui/components/table';
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
              className="cursor-pointer"
              key={index}
              onClick={() => handleRowClick(row.id)}>
              <TableCell className="px-6 py-4 font-semibold">
                {row.invoiceId}
              </TableCell>
              <TableCell className="px-6 py-4">
                <Tag variant="error">{i18n.get(INVOICE_TYPE.UNPAID)}</Tag>
              </TableCell>
              <TableCell className="px-6 py-4">
                {parseDate(row.dueDate)}
              </TableCell>
              <TableCell className="px-6 py-4">{row.exTaxTotal}</TableCell>
              <TableCell className="px-6 py-4 font-semibold">
                {row.inTaxTotal}
              </TableCell>
              <TableCell className="px-6 py-4">
                <Button className="flex items-center justify-center gap-3 w-full rounded-full">
                  {i18n.get('Pay')} <MdEast className="text-2xl" />
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
