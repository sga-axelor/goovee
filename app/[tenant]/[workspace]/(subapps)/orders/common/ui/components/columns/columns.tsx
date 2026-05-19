// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Chip} from '@/ui/components';
import {formatDate} from '@/lib/core/locale/formatters';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/orders/common/utils/orders';
import type {Order} from '@/subapps/orders/common/types/orders';

export const OrderColumns = [
  {
    key: 'saleOrderSeq',
    label: i18n.t('Order number'),
    sortable: true,
    mobile: true,
    getter: (row: Order) => row.saleOrderSeq,
    content: (row: Order) => (
      <span className="font-medium">{row.saleOrderSeq}</span>
    ),
  },
  {
    key: 'statusSelect',
    label: i18n.t('Status'),
    getter: (row: Order) => row.statusSelect,
    content: (row: Order) => {
      const {status, variant} = getStatus(row.statusSelect, row.deliveryState);
      return (
        <Chip
          className="font-normal text-[0.625rem]"
          value={i18n.t(status)}
          variant={variant}
        />
      );
    },
  },
  {
    key: 'createdOn',
    label: i18n.t('Created on'),
    sortable: true,
    getter: (row: Order) => row.createdOn,
    content: (row: Order) => formatDate(row.createdOn!),
  },
  {
    key: 'exTaxTotal',
    label: i18n.t('Total WT'),
    getter: (row: Order) => row.exTaxTotal,
    content: (row: Order) => row.exTaxTotal,
  },
  {
    key: 'inTaxTotal',
    label: i18n.t('Total ATI'),
    getter: (row: Order) => row.inTaxTotal,
    mobile: true,
    content: (row: Order) => (
      <span className="font-medium">{row.inTaxTotal}</span>
    ),
  },
];
