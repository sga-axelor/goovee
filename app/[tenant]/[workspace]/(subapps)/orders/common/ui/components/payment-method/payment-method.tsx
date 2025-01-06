'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components';
import {i18n} from '@/locale';

export const PaymentMethod = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">{i18n.t('Payment Method')}</h4>
        <Separator />
        <div className="flex flex-col gap-4 border !border-border] p-4 rounded-lg">
          <h4 className="text-xl font-semibold mb-0">
            {i18n.t('Paid with')}...
          </h4>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <h6 className="font-medium">{i18n.t('Card Number')}: </h6>
              <p>7639************</p>
            </div>
            <div className="flex">
              <h6 className="font-medium">{i18n.t('Expiration date')}: </h6>
              <p>**/**/27</p>
            </div>
            <div className="flex">
              <h6 className="font-medium">{i18n.t('Name')}: </h6>
              <p>Hem********</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaymentMethod;
