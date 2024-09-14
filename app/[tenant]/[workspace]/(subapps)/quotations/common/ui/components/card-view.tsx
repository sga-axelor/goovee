'use client';

import React from 'react';
import {LiaLongArrowAltRightSolid} from 'react-icons/lia';

// ---- CORE IMPORTS ---- //
import {Button, Tag} from '@/ui/components';
import {parseDate} from '@/utils/date';
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/quotations/common/utils/quotations';
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import type {
  Quotations,
  CardViewProps,
} from '@/subapps/quotations/common/types/quotations';

export const Card = ({quotations, onClick}: CardViewProps) => {
  return (
    <>
      {quotations?.map((quotation: Quotations, i: number) => {
        const {status, variant} = getStatus(quotation.statusSelect);
        return (
          <div
            key={quotation.id}
            className={`flex flex-col gap-4 bg-card border rounded px-4 py-6 mb-3 cursor-pointer`}
            onClick={() => onClick(quotation.id)}>
            <div className="flex items-center justify-between">
              <h6 className="font-semibold">{i18n.get('Quotation number')}</h6>
              <p className="text-sm font-semibold mb-0">
                {quotation.saleOrderSeq}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="font-semibold">{i18n.get('Status')}</h6>
              <div>
                <Tag variant={variant}>{status}</Tag>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="font-semibold">{i18n.get('Created on')}</h6>
              <p className="text-sm mb-0">{parseDate(quotation.createdOn)}</p>
            </div>
            <div className="flex items-center justify-between">
              {quotation?.statusSelect ===
                QUOTATION_STATUS.FINALISED_QUOTATION && (
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-3 rounded-full w-full font-normal">
                  {i18n.get('Give a reponse')}
                  <LiaLongArrowAltRightSolid className="text-2xl" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
export default Card;
