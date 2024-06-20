'use client';
import React from 'react';
import {Separator} from '@ui/components/separator';
import {Button} from '@ui/components/button';
// ---- CORE IMPORTS ---- //
import {getCityName} from '@/utils';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {PaymentMethod, Products} from '@/subapps/orders/common/ui/components';
export const Contact = ({
  clientPartner,
  company,
  mainInvoicingAddress,
  deliveryAddress,
  saleOrderLineList,
}: any) => {
  const billingAddressCity = getCityName(mainInvoicingAddress?.addressl6);
  const deliveryAddressCity = getCityName(deliveryAddress?.addressl6);
  return (
    <>
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-6 rounded-lg">
        <h4 className="text-xl font-medium mb-0">{i18n.get('Contact')}</h4>
        <div className="flex flex-col gap-4 border !border-border] p-4 rounded-lg">
          <div className="flex flex-col gap-4">
            <h6 className="text-base font-semibold mb-0">
              {i18n.get('Billing address')}
            </h6>
            <div className="flex flex-col gap-4">
              <h6 className="font-semibold text-base mb-0">
                {clientPartner?.fullName}, {company?.name}
              </h6>
              <div>
                <p className="text-base mb-0">
                  {mainInvoicingAddress?.addressl4}
                </p>
                <p className="text-base mb-0">{billingAddressCity}</p>
                <p className="text-base mb-0">{mainInvoicingAddress?.zip}</p>
                <p className="text-base mb-0">
                  {mainInvoicingAddress?.addressl7country?.name}
                </p>
              </div>
            </div>
            <div className="flex">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-3 rounded-full !font-medium basis-full md:basis-0">
                {i18n.get('Choose another adress')}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <h6 className="text-base font-semibold mb-0">
              {i18n.get('Delivery address')}
            </h6>
            <div className="flex flex-col gap-4">
              <h6 className="text-base font-semibold mb-0">
                {clientPartner?.fullName}, {company?.name}
              </h6>
              <div>
                <p className="text-base mb-0">{deliveryAddress?.addressl4}</p>
                <p className="text-base mb-0">{deliveryAddressCity}</p>
                <p className="text-base mb-0">{deliveryAddress.zip}</p>
                <p className="text-base mb-0">
                  {deliveryAddress?.addressl7country?.name}
                </p>
              </div>
            </div>
            <div className="flex">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-3 rounded-full !font-medium basis-full md:basis-0">
                {i18n.get('Choose another adress')}
              </Button>
            </div>
          </div>
        </div>
        <Products saleOrderLineList={saleOrderLineList} />
        {false && <PaymentMethod />}
      </div>
    </>
  );
};
export default Contact;
