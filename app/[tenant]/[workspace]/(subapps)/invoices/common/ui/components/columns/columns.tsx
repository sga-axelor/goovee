'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Chip} from '@/ui/components';
import {parseDate} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/invoices/common/utils/invoices';

export const ArchivedColumns = [
  {
    key: 'invoiceId',
    label: i18n.get('Invoice number'),
    sortable: true,
    mobile: true,
    getter: (row: any) => row.invoiceId,
    content: (row: any) => row.invoiceId,
  },
  {
    key: 'amountRemaining',
    label: i18n.get('Status'),
    getter: (row: any) => row.amountRemaining,
    content: (row: any) => {
      const {status, variant} = getStatus(row.amountRemaining);
      return <Chip value={status} variant={variant} />;
    },
  },
  {
    key: 'dueDate',
    label: i18n.get('Due on'),
    sortable: true,
    getter: (row: any) => row.dueDate,
    content: (row: any) => parseDate(row.dueDate),
  },
  {
    key: 'exTaxTotal',
    label: i18n.get('Total WT'),
    getter: (row: any) => row.exTaxTotal,
    content: (row: any) => row.exTaxTotal,
  },
  {
    key: 'inTaxTotal',
    label: i18n.get('Total ATI'),
    getter: (row: any) => row.inTaxTotal,
    mobile: true,
    content: (row: any) => row.inTaxTotal,
  },
];
