'use client';

import {MdEast} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {parseDate} from '@/utils/date';
import {Button, Chip} from '@/ui/components';
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/quotations/common/utils/quotations';
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';

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
          value={status}
          className="font-normal text-sm"
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
    content: (row: any) => parseDate(row.createdOn),
  },
  {
    key: 'action',
    label: i18n.t(''),
    getter: () => 'action',
    content: (row: any) => {
      return (
        <div className="flex justify-center">
          {row?.statusSelect === QUOTATION_STATUS.FINALISED_QUOTATION ? (
            <Button
              variant="outline"
              className="h-9 bg-white hover:bg-success-light text-success hover:text-success border-success flex items-center justify-center gap-2 w-fit rounded-[0.375rem] py-1.5 px-3 text-base !font-medium">
              {i18n.t('Give a reponse')} <MdEast className="text-2xl" />
            </Button>
          ) : (
            false && (
              <Button
                className={cn(
                  'h-9 bg-success hover:bg-success-dark flex items-center justify-center gap-2 min-w-[10.688rem] rounded-[0.375rem] py-1.5 px-3 text-base !font-medium',
                )}>
                {i18n.t('Pay')} <MdEast className="text-2xl" />
              </Button>
            )
          )}
        </div>
      );
    },
  },
];
