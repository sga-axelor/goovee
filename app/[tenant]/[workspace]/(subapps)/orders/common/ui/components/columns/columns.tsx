// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Chip} from '@/ui/components';
import {parseDate} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/orders/common/utils/orders';

export const OrderColumns = [
  {
    key: 'saleOrderSeq',
    label: i18n.get('Order number'),
    sortable: true,
    mobile: true,
    getter: (row: any) => row.saleOrderSeq,
    content: (row: any) => (
      <span className="font-medium">{row.saleOrderSeq}</span>
    ),
  },
  {
    key: 'statusSelect',
    label: i18n.get('Status'),
    getter: (row: any) => row.statusSelect,
    content: (row: any) => {
      const {status, variant} = getStatus(row.statusSelect, row.deliveryState);
      return (
        <Chip
          className="font-normal text-sm"
          value={status}
          variant={variant}
        />
      );
    },
  },
  {
    key: 'createdOn',
    label: i18n.get('Created on'),
    sortable: true,
    getter: (row: any) => row.createdOn,
    content: (row: any) => parseDate(row.createdOn),
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
