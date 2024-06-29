'use client';
import React from 'react';
import {Separator} from '@ui/components/separator';
// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils';
import {Tag} from '@ui/components/index';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {Invoice, Total} from '@/subapps/invoices/common/ui/components';
import {
  INVOICE_STATUS,
  INVOICE_TYPE,
} from '@/subapps/invoices/common/constants/invoices';

export default function Content({invoice}: any) {
  const {
    invoiceId,
    dueDate,
    invoiceDate,
    inTaxTotal,
    exTaxTotal,
    amountRemaining,
    invoiceLineList,
    currency: {numberOfDecimals},
  } = invoice;
  const status =
    Number(amountRemaining.value) !== INVOICE_STATUS.UNPAID
      ? INVOICE_TYPE.UNPAID
      : INVOICE_TYPE.PAID;
  const isUnpaid = status === INVOICE_TYPE.UNPAID;

  return (
    <>
      <div className="px-4 md:px-12 py-2 md:py-4">
        <h4 className="text-xl font-medium mb-4">
          {i18n.get('Invoice number')} {invoiceId}
        </h4>
        <div className="bg-card text-card-foreground flex md:block flex-col md:flex-row px-6 py-4 mb-6 rounded-lg">
          <h4 className="text-xl font-medium mb-0">
            {i18n.get('Informations')}
          </h4>
          <Separator className="my-2" />
          <div>
            <div className="flex items-center gap-4">
              <h5 className="text-lg font-semibold">{i18n.get('Status')}:</h5>
              <div>
                <Tag variant={isUnpaid ? 'destructive' : 'success'}>
                  {i18n.get(status)}
                </Tag>
              </div>
            </div>
            <div className="flex items-center gap-[0.1rem] mt-1">
              <h5 className="text-lg font-semibold pr-1">
                {isUnpaid
                  ? `${i18n.get('Due date:')}`
                  : `${i18n.get('Paid on:')}`}
              </h5>
              <p>{parseDate(isUnpaid ? dueDate : invoiceDate)}</p>
            </div>
          </div>
        </div>
        <div className="block md:flex flex-col lg:flex-row gap-4 mb-6 rounded-lg">
          <Invoice invoice={invoice} isUnpaid={isUnpaid} />
          {isUnpaid && (
            <Total
              exTaxTotal={exTaxTotal}
              inTaxTotal={inTaxTotal}
              invoiceLineList={invoiceLineList}
              numberOfDecimals={numberOfDecimals}
            />
          )}
        </div>
      </div>
    </>
  );
}
