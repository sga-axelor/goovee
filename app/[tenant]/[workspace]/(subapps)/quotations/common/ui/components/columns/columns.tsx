'use client';

import {MdEast} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Button, Chip} from '@/ui/components';
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/quotations/common/utils/quotations';

export const Columns = [
  {
    key: 'saleOrderSeq',
    label: i18n.t('Quotation number'),
    sortable: true,
    mobile: true,
    getter: (row: any) => row.saleOrderSeq,
    content: (row: any) => (
      <span className="font-medium">
        {i18n.t('Sale quotation')} {row.saleOrderSeq}
        {row.externalReference && ` ( ${row.externalReference} )`}
      </span>
    ),
  },
  {
    key: 'statusSelect',
    label: i18n.t('Status'),
    getter: (row: any) => row.statusSelect,
    content: (row: any) => {
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
    getter: (row: any) => row.createdOn,
    content: (row: any) => row.createdOn,
  },
];
