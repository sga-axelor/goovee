'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils/date';
import {Tag, Separator} from '@/ui/components';
import {i18n} from '@/locale';

// ---- LOCAL IMPORTS ---- //
import {Invoice, Total} from '@/subapps/invoices/common/ui/components';
import {
  INVOICE_STATUS,
  INVOICE_TYPE,
} from '@/subapps/invoices/common/constants/invoices';

export default function Content({invoice, workspace}: any) {
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

  const config = workspace?.config;

  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const canPayInvoice = config?.canPayInvoice;
  const paymentOptionSet = config?.paymentOptionSet;

  const allowInvoicePayment =
    isUnpaid &&
    allowOnlinePayment &&
    canPayInvoice !== 'no' &&
    Boolean(paymentOptionSet?.length);

  return (
    <>
      <div className="px-4 md:px-12 py-2 md:py-4">
        <h4 className="text-xl font-medium mb-4">
          {i18n.t('Invoice number')} {invoiceId}
        </h4>
        <div className="bg-card text-card-foreground flex md:block flex-col md:flex-row px-6 py-4 mb-6 rounded-lg">
          <h4 className="text-xl font-medium mb-0">{i18n.t('Informations')}</h4>
          <Separator className="my-2" />
          <div>
            <div className="flex items-center gap-4">
              <h5 className="text-lg font-semibold">{i18n.t('Status')}:</h5>
              <div>
                <Tag variant={isUnpaid ? 'destructive' : 'success'}>
                  {i18n.t(status)}
                </Tag>
              </div>
            </div>
            <div className="flex items-center gap-[0.1rem] mt-1">
              <h5 className="text-lg font-semibold pr-1">
                {isUnpaid ? `${i18n.t('Due date:')}` : `${i18n.t('Paid on:')}`}
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
              allowInvoicePayment={allowInvoicePayment}
            />
          )}
        </div>
      </div>
    </>
  );
}
