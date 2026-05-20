'use client';

import {MdEast} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Button, Chip} from '@/ui/components';
import {cn} from '@/utils/css';
import {formatDate} from '@/lib/core/locale/formatters';

// ---- LOCAL IMPORTS ---- //
import {INVOICE_TYPE} from '@/subapps/invoices/common/constants/invoices';
import type {InvoiceListItem} from '@/subapps/invoices/common/types/invoices';

export const Columns = [
  {
    key: 'invoiceId',
    label: i18n.t('Invoice number'),
    sortable: true,
    mobile: true,
    getter: (row: InvoiceListItem) => row.invoiceId,
    content: (row: InvoiceListItem) => (
      <span className="font-medium ">{row.invoiceId}</span>
    ),
  },
  {
    key: 'amountRemaining',
    label: i18n.t('Status'),
    getter: (row: InvoiceListItem) => row.amountRemaining,
    content: (row: InvoiceListItem) => {
      const status = row.isUnpaid ? INVOICE_TYPE.UNPAID : INVOICE_TYPE.PAID;
      const variant = row.isUnpaid ? 'destructive' : 'success';
      return (
        <Chip
          value={i18n.t(status)}
          className="font-normal text-[0.625rem]"
          variant={variant}
        />
      );
    },
  },
  {
    key: 'dueDate',
    label: i18n.t('Due on'),
    sortable: true,
    getter: (row: InvoiceListItem) => row.dueDate,
    content: (row: InvoiceListItem) => formatDate(row.dueDate),
  },
  {
    key: 'exTaxTotal',
    label: i18n.t('Total WT'),
    getter: (row: InvoiceListItem) => row.exTaxTotal,
    content: (row: InvoiceListItem) => row.exTaxTotal,
  },
  {
    key: 'inTaxTotal',
    label: i18n.t('Total ATI'),
    getter: (row: InvoiceListItem) => row.inTaxTotal,
    mobile: true,
    content: (row: InvoiceListItem) => (
      <span className="font-medium">{row.inTaxTotal}</span>
    ),
  },
];

export const UnpaidColumns = (allowInvoicePayment?: boolean) => {
  return [
    ...Columns,
    {
      key: 'action',
      label: i18n.t(''),
      getter: () => 'action',
      content: () => (
        <Button
          variant="success"
          className={cn(
            'h-9 flex items-center justify-center gap-2 w-full rounded-[0.375rem] p-1.5 text-base',
            {
              hidden: !allowInvoicePayment,
            },
          )}>
          {i18n.t('Pay')} <MdEast className="text-2xl" />
        </Button>
      ),
    },
  ];
};
