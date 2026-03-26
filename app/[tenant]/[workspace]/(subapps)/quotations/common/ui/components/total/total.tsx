'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Separator} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import type {TotalProps} from '@/subapps/quotations/common/types/quotations';

export const Total = ({
  exTaxTotal,
  inTaxTotal,
  totalDiscount,
  hideDiscount,
}: TotalProps) => {
  return (
    <>
      <div className="flex flex-col bg-card text-card-foreground px-6 py-4 rounded-lg">
        <h4 className="text-xl font-medium mb-0">{i18n.t('Offered price')}</h4>
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
            <h6 className="font-medium">{i18n.t('Total price')}:</h6>
            <h4 className="text-xl font-medium whitespace-nowrap">
              {inTaxTotal}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Total;
