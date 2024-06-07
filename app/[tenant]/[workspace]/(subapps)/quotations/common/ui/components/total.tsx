'use client';
import React from 'react';
import { Separator } from "@ui/components/separator"
import { Button } from "@ui/components/button"
import { MdCheckCircleOutline } from "react-icons/md";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
// ---- CORE IMPORTS ---- //
import { i18n } from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import { QUOTATION_STATUS } from '@/subapps/quotations/common/constants/quotations';
import type { TotalProps } from '@/subapps/quotations/common/types/quotations';
import styles from './styles.module.scss';
export const Total = ({
  exTaxTotal,
  inTaxTotal,
  totalDiscount,
  statusSelect,
}: TotalProps) => {
  return (
    <>
      <div className="flex flex-col bg-white px-6 py-4 rounded-lg border border-black">
        <h4 className="text-xl font-medium mb-0">
          {i18n.get('Offered price')}
        </h4>
        <Separator className="my-3" />
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-base mb-0">{i18n.get('Total WT')}:</p>
              <p className="text-base mb-0">{exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base mb-0">{i18n.get('Total ATI')}:</p>
              <p className="text-base mb-0">{inTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base mb-0">{i18n.get('Discount')}:</p>
              <p className="text-base mb-0">{totalDiscount}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h6 className="text-base font-medium mb-0">{i18n.get('Total price')}:</h6>
            <h4 className="text-xl font-medium mb-0">
              {inTaxTotal}
            </h4>
          </div>
          {statusSelect !== QUOTATION_STATUS.CANCELED_QUOTATION && (
            <>
              <div className="flex justify-center">
                <Button
                  className={`${styles.success} flex items-center justify-center gap-3 rounded-full w-full`}>
                  <MdCheckCircleOutline className="text-2xl" />
                  {i18n.get('Accept and sign')}
                </Button>
              </div>
              <div className="flex justify-center">
                <Button
                  className={`${styles.danger} flex items-center justify-center gap-3 rounded-full w-full font-normal`}>
                  <MdOutlineDisabledByDefault className="text-2xl" />
                  {i18n.get('Reject')}
                </Button>
              </div>
            </>
          )}
          {false && (
            <div className="flex justify-center">
              <Button
                className="flex items-center justify-center gap-3 rounded-full w-full font-normal">
                {i18n.get('Pay')} <LiaLongArrowAltRightSolid className="text-2xl" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Total;