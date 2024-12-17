'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {getCityName} from '@/utils';
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import type {ContactProps} from '@/subapps/quotations/common/types/quotations';

export const ContactDetails = ({
  clientPartner,
  company,
  mainInvoicingAddress,
  deliveryAddress,
  showAddressSelectionButton,
  onAddressSelection,
}: ContactProps & {
  onAddressSelection: () => void;
  showAddressSelectionButton?: boolean;
}) => {
  const billingAddressCity = getCityName(mainInvoicingAddress?.addressl6);
  const deliveryAddressCity = getCityName(deliveryAddress?.addressl6);

  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">{i18n.get('Contact')}</h4>
        <div className="flex flex-col gap-4 border rounded-lg p-4">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-4">
              <h6 className="font-semibold text-base">
                {i18n.get('Invoicing address')}
              </h6>
              <div className="flex flex-col gap-4">
                <h6 className="font-semibold text-base">
                  {clientPartner?.fullName}, {company?.name}
                </h6>
                <div className="text-sm leading-[1.313rem]">
                  <p>{mainInvoicingAddress?.addressl4}</p>
                  <p>{billingAddressCity}</p>
                  <p>{mainInvoicingAddress?.zip}</p>
                  <p>{mainInvoicingAddress?.country?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <h6 className="font-semibold">{i18n.get('Delivery address')}</h6>
              <div className="flex flex-col gap-4">
                <h6 className="font-semibold text-base">
                  {clientPartner?.fullName}, {company?.name}
                </h6>
                <div className="text-sm leading-[1.313rem]">
                  <p>{deliveryAddress?.addressl4}</p>
                  <p>{deliveryAddressCity}</p>
                  <p>{deliveryAddress?.zip}</p>
                  <p>{deliveryAddress?.country?.name}</p>
                </div>
              </div>
            </div>
          </div>
          {showAddressSelectionButton && (
            <div className="flex">
              <Button
                className="bg-white border border-success text-success hover:bg-success hover:text-white rounded-md font-medium text-base py-1.5 px-3"
                onClick={onAddressSelection}>
                {i18n.get('Choose another address')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ContactDetails;
