'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Chip} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/quotations/common/utils/quotations';
import {formatDate} from '@/lib/core/locale/formatters';
import type {Quotation} from '@/subapps/quotations/common/types/quotations';

export const Columns = [
  {
    key: 'saleOrderSeq',
    label: i18n.t('Quotation number'),
    sortable: true,
    mobile: true,
    getter: (row: Quotation) => row.saleOrderSeq,
    content: (row: Quotation) => (
      <span className="font-medium">
        {i18n.t('Sale quotation')} {row.saleOrderSeq}
        {row.externalReference && ` ( ${row.externalReference} )`}
      </span>
    ),
  },
  {
    key: 'statusSelect',
    label: i18n.t('Status'),
    getter: (row: Quotation) => row.statusSelect,
    content: (row: Quotation) => {
      const {status, variant} = getStatus(row.statusSelect);
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
    key: 'createdOn',
    label: i18n.t('Created on'),
    sortable: true,
    getter: (row: Quotation) => row.createdOn,
    content: (row: Quotation) => formatDate(row.createdOn!),
  },
];
