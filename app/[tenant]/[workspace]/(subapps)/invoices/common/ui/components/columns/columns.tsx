'use client';

import {MdEast} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Button, Chip} from '@/ui/components';
import {parseDate} from '@/utils/date';
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/invoices/common/utils/invoices';

export const Columns = [
  {
    key: 'invoiceId',
    label: i18n.t('Invoice number'),
    sortable: true,
    mobile: true,
    getter: (row: any) => row.invoiceId,
    content: (row: any) => <span className="font-medium">{row.invoiceId}</span>,
  },
  {
    key: 'amountRemaining',
    label: i18n.t('Status'),
    getter: (row: any) => row.amountRemaining,
    content: (row: any) => {
      const {status, variant} = getStatus(row.amountRemaining);
      return (
        <Chip
          value={status}
          className="font-normal text-sm"
          variant={variant}
        />
      );
    },
  },
  {
    key: 'dueDate',
    label: i18n.t('Due on'),
    sortable: true,
    getter: (row: any) => row.dueDate,
    content: (row: any) => parseDate(row.dueDate),
  },
  {
    key: 'exTaxTotal',
    label: i18n.t('Total WT'),
    getter: (row: any) => row.exTaxTotal,
    content: (row: any) => row.exTaxTotal,
  },
  {
    key: 'inTaxTotal',
    label: i18n.t('Total ATI'),
    getter: (row: any) => row.inTaxTotal,
    mobile: true,
    content: (row: any) => row.inTaxTotal,
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
          className={cn(
            'h-9 bg-success hover:bg-success-dark flex items-center justify-center gap-2 w-full rounded-[0.375rem] p-1.5 text-base',
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
