'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components';
import {i18n} from '@/i18n';

export type TotalProps = {
  inTaxTotal: string;
  exTaxTotal: number | string;
  totalDiscount: number;
};
export const Total = ({exTaxTotal, inTaxTotal, totalDiscount}: TotalProps) => {
  return (
    <>
      <div
        className="flex flex-col bg-card text-card-foreground px-6 py-4 rounded-lg basis-full md:basis-1/4"
        style={{height: 'fit-content'}}>
        <h4 className="text-xl font-medium mb-0">{i18n.get('Total price')}</h4>
        <Separator className="my-3" />
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>{i18n.get('Total WT')}:</p>
              <p>{exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>{i18n.get('Total ATI')}:</p>
              <p>{inTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>{i18n.get('Discount')}:</p>
              <p>{totalDiscount}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium mb-0">
              {i18n.get('Total price')}:
            </h4>
            <h4 className="text-xl font-medium mb-0">{inTaxTotal}</h4>
          </div>
        </div>
      </div>
    </>
  );
};
export default Total;
