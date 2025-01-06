'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {getCityName} from '@/utils';
import {i18n} from '@/locale';

export const Contact = ({
  clientPartner,
  company,
  mainInvoicingAddress,
  deliveryAddress,
}: any) => {
  const billingAddressCity = getCityName(mainInvoicingAddress?.addressl6);
  const deliveryAddressCity = getCityName(deliveryAddress?.addressl6);
  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">{i18n.t('Contact')}</h4>
        <div className="flex flex-col gap-4 border rounded-lg p-4">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-4">
              <h6 className="font-semibold text-base">
                {i18n.t('Invoicing address')}
              </h6>
              <div className="flex flex-col gap-4">
                <div className="font-semibold text-base">
                  {clientPartner?.fullName}, {company?.name}
                </div>
                <div className="text-sm leading-[1.313rem]">
                  <p>{mainInvoicingAddress?.addressl4}</p>
                  <p>{billingAddressCity}</p>
                  <p>{mainInvoicingAddress?.zip}</p>
                  <p>{mainInvoicingAddress?.country?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <h6 className="font-semibold text-base">
                {i18n.t('Delivery address')}
              </h6>
              <div className="flex flex-col gap-4">
                <div className="font-semibold text-base">
                  {clientPartner?.fullName}, {company?.name}
                </div>
                <div className="text-sm leading-[1.313rem]">
                  <p>{deliveryAddress?.addressl4}</p>
                  <p>{deliveryAddressCity}</p>
                  <p>{deliveryAddress.zip}</p>
                  <p>{deliveryAddress?.country?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contact;
