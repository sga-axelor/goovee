'use client';
import React from 'react';
import {Separator} from '@ui/components/separator';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
export const PaymentMethod = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">
          {i18n.get('Payment Method')}
        </h4>
        <Separator />
        <div className="flex flex-col gap-4 border !border-border] p-4 rounded-lg">
          <h4 className="text-xl font-semibold mb-0">
            {i18n.get('Paid with')}...
          </h4>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <h6 className="text-base font-medium mb-0">
                {i18n.get('Card Number')}:{' '}
              </h6>
              <p className="text-base mb-0">7639************</p>
            </div>
            <div className="flex">
              <h6 className="text-base font-medium mb-0">
                {i18n.get('Expiration date')}:{' '}
              </h6>
              <p className="text-base mb-0">**/**/27</p>
            </div>
            <div className="flex">
              <h6 className="text-base font-medium mb-0">
                {i18n.get('Name')}:{' '}
              </h6>
              <p className="text-base mb-0">Hem********</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaymentMethod;
