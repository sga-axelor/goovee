'use client';

import {PayPalScriptProvider, PayPalButtons} from '@paypal/react-paypal-js';

// ---- CORE IMPORTS ---- //
import {DEFAULT_CURRENCY_CODE} from '@/constants';

type PaypalProps = {
  currency?: string;
  clientId: string;
  onCreateOrder: any;
  onApprove: any;
};

export function Paypal({
  currency,
  clientId,
  onCreateOrder,
  onApprove,
}: PaypalProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: currency ?? DEFAULT_CURRENCY_CODE,
        intent: 'capture',
        disableFunding: 'card',
      }}>
      <PayPalButtons
        style={{
          color: 'blue',
          shape: 'rect',
          height: 50,
        }}
        createOrder={onCreateOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
}

export default Paypal;
