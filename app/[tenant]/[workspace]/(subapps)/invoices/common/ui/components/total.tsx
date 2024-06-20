'use client';
import React from 'react';
import {MdEast} from 'react-icons/md';
import {Button} from '@ui/components/button';
import {Separator} from '@ui/components/separator';
// ---- CORE IMPORTS ---- //
import {DEFAULT_CURRENCY_SCALE} from '@/constants';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {TotalProps} from '@/subapps/invoices/common/types/invoices';
export function Total({
  exTaxTotal,
  inTaxTotal,
  invoiceLineList,
  numberOfDecimals,
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
        <h4 className="text-xl font-medium mb-0">{i18n.get('Total')}</h4>
        <Separator className="my-3" />
        <div className="flex flex-col gap-4 mb-3">
          <div className="flex flex-col gap-[0.5rem]">
            <div className="flex items-center justify-between">
              <p className="text-base mb-0">{i18n.get('Total WT')}:</p>
              <p className="text-base mb-0">{exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="text-base font-medium mb-0">
                {i18n.get('Total ATI')}:
              </h6>
              <h6 className="text-base font-medium mb-0">{inTaxTotal}</h6>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base mb-0">{i18n.get('Discount')}:</p>
              <p className="text-base mb-0">{discount}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium mb-0">
              {i18n.get('Total price')}:
            </h4>
            <h4 className="text-xl font-medium mb-0">{inTaxTotal}</h4>
          </div>
        </div>
        <div>
          <Button className="flex items-center justify-center gap-3 w-full rounded-full">
            {i18n.get('Pay')} <MdEast className="text-2xl" />
          </Button>
        </div>
      </div>
    </>
  );
}
export default Total;
