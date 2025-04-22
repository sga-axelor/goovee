'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components';
import {i18n} from '@/locale';

export type TotalProps = {
  inTaxTotal: string;
  exTaxTotal: number | string;
  totalDiscount: number;
  hideDiscount: boolean;
};
export const Total = ({
  exTaxTotal,
  inTaxTotal,
  totalDiscount,
  hideDiscount,
}: TotalProps) => {
  return (
    <>
      <div
        className="flex flex-col bg-card text-card-foreground px-6 py-4 rounded-lg"
        style={{height: 'fit-content'}}>
        <h4 className="text-xl font-medium mb-0">{i18n.t('Total price')}</h4>
        <Separator className="my-2.5" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>{i18n.t('Total WT')}:</p>
              <p className="whitespace-nowrap">{exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>{i18n.t('Total ATI')}:</p>
              <p className="whitespace-nowrap">{inTaxTotal}</p>
            </div>
            {!hideDiscount && (
              <div className="flex items-center justify-between">
                <p>{i18n.t('Discount')}:</p>
                <p className="whitespace-nowrap">{totalDiscount}%</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <h4 className="font-medium mb-0">{i18n.t('Total price')}:</h4>
            <h4 className="text-xl font-medium mb-0 whitespace-nowrap">
              {inTaxTotal}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Total;
