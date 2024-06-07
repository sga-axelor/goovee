'use client';
import React from 'react';
import { MdEast } from "react-icons/md";
import { Button } from "@ui/components/button"
// ---- CORE IMPORTS ---- //
import { parseDate } from '@/utils';
import { Tag } from '@/ui/components';
import { i18n } from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import { getStatus } from '@/subapps/invoices/common/utils/invoices';
export const Card = ({
  invoices,
  handleRowClick,
}: {
  invoices: [];
  handleRowClick: (id: string) => void;
}) => {
  return (
    <>
      <div className="block md:hidden">
        {invoices?.map((invoice: any, i: number) => {
          const { status, variant } = getStatus(invoice.amountRemaining);
          return (
            <div
              key={i}
              className="rounded border border-solid !border-[#E6E7E7] bg-white px-4 py-6 flex flex-col gap-4 !cursor-pointer"
              onClick={() => handleRowClick(invoice.id)}>
              <div className="flex items-center justify-between font-bold">
                <h6 className='text-base mb-0'>{i18n.get('Invoice number')}</h6>
                <h6 className='text-base mb-0'>{invoice.invoiceId}</h6>
              </div>
              <div className="flex items-center justify-between">
                <h6 className='text-base font-bold mb-0'>{i18n.get('Status')}</h6>
                <p className='text-base mb-0'>
                  <Tag variant={variant}>{status}</Tag>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <h6 className='text-base font-bold mb-0'>{i18n.get('Created on')}</h6>
                <p className='text-base mb-0'>{parseDate(invoice.dueDate)}</p>
              </div>
              <div className="flex items-center justify-between">
                <h6 className='text-base font-bold mb-0'>{i18n.get('Total WT')}</h6>
                <p className='text-base mb-0'> {invoice.exTaxTotal}</p>
              </div>
              <div className="flex items-center justify-between">
                <h6 className='text-base font-bold mb-0'>{i18n.get('Total ATI')}</h6>
                <h5 className='text-lg font-bold mb-0'>
                  {invoice.inTaxTotal}
                </h5>
              </div>
              <div>
                <Button className="flex items-center justify-center gap-3 w-full rounded-full">
                  {i18n.get('Pay')} <MdEast className="text-2xl" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Card;