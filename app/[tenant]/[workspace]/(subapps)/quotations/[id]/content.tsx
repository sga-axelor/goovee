'use client';
import React from 'react';
// ---- CORE IMPORTS ---- //
import {Container} from '@/ui/components';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {
  Comments,
  History,
  Informations,
  Total,
  Contacts,
} from '@/subapps/quotations/common/ui/components';
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import type {
  CommentsProps,
  Quotation,
} from '@/subapps/quotations/common/types/quotations';
type Props = {
  quotation: Quotation;
  comments: CommentsProps[];
};
const Content = ({quotation, comments}: Props) => {
  const {
    saleOrderSeq,
    exTaxTotal,
    inTaxTotal,
    endOfValidityDate,
    clientPartner,
    mainInvoicingAddress,
    deliveryAddress,
    company,
    saleOrderLineList,
    totalDiscount,
    statusSelect,
  } = quotation;

  return (
    <>
      <Container title={`${i18n.get('Quotation')} ${saleOrderSeq}`}>
        <Informations
          endOfValidityDate={endOfValidityDate}
          statusSelect={statusSelect}
        />
        <div className="flex flex-col-reverse xl:flex-row gap-6 xl:gap-4">
          <div
            className={`${statusSelect !== QUOTATION_STATUS.DRAFT_QUOTATION ? 'lg:basis-3/4' : 'lg:basis-full'} flex flex-col gap-6 basis-full`}>
            <Contacts
              clientPartner={clientPartner}
              company={company}
              mainInvoicingAddress={mainInvoicingAddress}
              deliveryAddress={deliveryAddress}
              saleOrderLineList={saleOrderLineList}
            />
            <History />
            <Comments comments={comments} />
          </div>
          {statusSelect !== QUOTATION_STATUS.DRAFT_QUOTATION && (
            <div className="flex flex-col gap-6 basis-full lg:basis-1/4">
              <Total
                exTaxTotal={exTaxTotal}
                inTaxTotal={inTaxTotal}
                statusSelect={statusSelect}
                totalDiscount={totalDiscount}
              />
            </div>
          )}
        </div>
      </Container>
    </>
  );
};
export default Content;
