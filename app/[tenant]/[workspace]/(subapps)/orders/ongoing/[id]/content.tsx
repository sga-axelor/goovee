'use client';
import React from 'react';
// ---- CORE IMPORTS ---- //
import {Container} from '@ui/components/index';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {
  Contact,
  ContactUs,
  History,
  Informations,
  Total,
} from '@/subapps/orders/common/ui/components';
import {getStatus} from '@/subapps/orders/common/utils/orders';
import {ORDER_TYPE} from '@/subapps/orders/common/constants/orders';
const Content = ({order}: {order: any}) => {
  const {
    saleOrderSeq,
    exTaxTotal,
    inTaxTotal,
    createdOn,
    shipmentMode,
    statusSelect,
    deliveryState,
    clientPartner,
    mainInvoicingAddress,
    deliveryAddress,
    company,
    saleOrderLineList,
    totalDiscount,
  } = order;
  const {status, variant} = getStatus(statusSelect, deliveryState);
  const showContactUs = ![ORDER_TYPE.CLOSED].includes(status);

  return (
    <>
      <Container title={`${i18n.get('Order number')} ${saleOrderSeq}`}>
        <Informations
          createdOn={createdOn}
          shipmentMode={shipmentMode}
          status={status}
          variant={variant}
        />
        <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-4">
          <div className="flex flex-col gap-6 basis-full md:basis-3/4">
            <Contact
              clientPartner={clientPartner}
              company={company}
              mainInvoicingAddress={mainInvoicingAddress}
              deliveryAddress={deliveryAddress}
              saleOrderLineList={saleOrderLineList}
            />
            {false && <History />}
            {showContactUs && <ContactUs />}
          </div>
          <Total
            exTaxTotal={exTaxTotal}
            inTaxTotal={inTaxTotal}
            totalDiscount={totalDiscount}
          />
        </div>
      </Container>
    </>
  );
};
export default Content;
