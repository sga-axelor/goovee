'use client';
import React from 'react';
import {Button} from '@ui/components/button';
import {LiaLongArrowAltRightSolid} from 'react-icons/lia';
// ---- CORE IMPORTS ---- //
import {Tag} from '@ui/components/index';
import {parseDate} from '@/utils';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/quotations/common/utils/quotations';
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import type {
  Quotations,
  CardViewProps,
} from '@/subapps/quotations/common/types/quotations';
import styles from './styles.module.scss';
export const Card = ({quotations, onClick}: CardViewProps) => {
  return (
    <>
      {quotations?.map((quotation: Quotations, i: number) => {
        const {status, variant} = getStatus(quotation.statusSelect);
        return (
          <div
            key={quotation.id}
            className={`${styles['card-wrapper']} bg-white flex flex-col gap-4 border rounded px-4 py-6`}
            onClick={() => onClick(quotation.id)}>
            <div className="flex items-center justify-between">
              <h6 className="text-base font-semibold mb-0">
                {i18n.get('Quotation number')}
              </h6>
              <p className="text-sm font-semibold mb-0">
                {quotation.saleOrderSeq}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="text-base font-semibold mb-0">
                {i18n.get('Status')}
              </h6>
              <div>
                <Tag variant={variant}>{status}</Tag>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="text-base font-semibold mb-0">
                {i18n.get('Created on')}
              </h6>
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
