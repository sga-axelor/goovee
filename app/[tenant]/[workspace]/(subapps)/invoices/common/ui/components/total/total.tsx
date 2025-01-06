'use client';

import React from 'react';
import {MdEast} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {DEFAULT_CURRENCY_SCALE} from '@/constants';
import {i18n} from '@/locale';
import {cn} from '@/utils/css';
import {Button, Separator} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {TotalProps} from '@/subapps/invoices/common/types/invoices';

export function Total({
  exTaxTotal,
  inTaxTotal,
  invoiceLineList,
  numberOfDecimals,
  allowInvoicePayment,
}: TotalProps) {
  const sumOfDiscounts: number = invoiceLineList.reduce(
    (total, {discountAmount}) => {
      return total + parseFloat(discountAmount);
    },
    0,
  );

  const discount =
    sumOfDiscounts === 0
      ? 0
      : ((100 * sumOfDiscounts) / (sumOfDiscounts + +exTaxTotal)).toFixed(
          numberOfDecimals || DEFAULT_CURRENCY_SCALE,
        );

  return (
    <>
      <div
        className="flex basis-full md:basis-1/4 flex-col bg-card text-card-foreground p-4 md:p-6 border rounded-lg border-card-foreground mt-6 md:mt-0"
        style={{height: 'fit-content'}}>
        <h4 className="text-xl font-medium mb-0">{i18n.t('Total')}</h4>
        <Separator className="my-3" />
        <div className="flex flex-col gap-4 mb-3">
          <div className="flex flex-col gap-[0.5rem]">
            <div className="flex items-center justify-between">
              <p>{i18n.t('Total WT')}:</p>
              <p>{exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="font-medium">{i18n.t('Total ATI')}:</h6>
              <h6 className="font-medium">{inTaxTotal}</h6>
            </div>
            <div className="flex items-center justify-between">
              <p>{i18n.t('Discount')}:</p>
              <p>{discount}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium mb-0">
              {i18n.t('Total price')}:
            </h4>
            <h4 className="text-xl font-medium mb-0">{inTaxTotal}</h4>
          </div>
        </div>
        <div>
          <Button
            className={cn(
              'flex items-center justify-center gap-3 w-full rounded-full',
              {
                hidden: !allowInvoicePayment,
              },
            )}>
            {i18n.t('Pay')} <MdEast className="text-2xl" />
          </Button>
        </div>
      </div>
    </>
  );
}
export default Total;
