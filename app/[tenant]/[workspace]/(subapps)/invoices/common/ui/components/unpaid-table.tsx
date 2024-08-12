'use client';

import React from 'react';
import {MdEast} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {cn} from '@/utils/css';
import {parseDate} from '@/utils/date';
import {StyledTable, Tag, TableCell, TableRow, Button} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import type {Item} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {INVOICE_TYPE} from '@/subapps/invoices/common/constants/invoices';

export const UnpaidTable = ({
  columns,
  rows,
  handleRowClick,
  allowInvoicePayment,
}: {
  columns: Item[];
  rows: [];
  handleRowClick: (id: string) => void;
  allowInvoicePayment?: boolean;
}) => {
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
                <Tag variant="destructive">{i18n.get(INVOICE_TYPE.UNPAID)}</Tag>
              </TableCell>
              <TableCell className="px-6 py-4">
                {parseDate(row.dueDate)}
              </TableCell>
              <TableCell className="px-6 py-4">{row.exTaxTotal}</TableCell>
              <TableCell className="px-6 py-4 font-semibold">
                {row.inTaxTotal}
              </TableCell>
              <TableCell className="px-6 py-4">
                <Button
                  className={cn(
                    'flex items-center justify-center gap-3 w-full rounded-full',
                    {
                      hidden: !allowInvoicePayment,
                    },
                  )}>
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
