import PayPalHttpClient from '.';
import paypal from '@paypal/checkout-server-sdk';
import {DEFAULT_CURRENCY_CODE} from '@/constants';

export async function createPaypalOrder({
  amount,
  email,
  currency = DEFAULT_CURRENCY_CODE,
}: {
  amount: string | number;
  email: string;
  currency: string;
}) {
  if (!(amount && currency && email)) {
    throw new Error('Amount, currency and email is required');
  }

  const PaypalClient = PayPalHttpClient();

  const request = new paypal.orders.OrdersCreateRequest();

  request.headers['Prefer'] = 'return=representation';

  request.requestBody({
    intent: 'CAPTURE',
    payer: {
      email_address: email,
    } as any,
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount + '',
        },
      },
    ],
  });

  let response;
  try {
    response = await PaypalClient.execute(request);
  } catch (err) {
    throw new Error('Error processing payment. Try again');
  }

  if (response?.statusCode !== 201) {
    throw new Error('Error processing payment. Try again');
  }

  return response;
}

export async function findPaypalOrder({id}: {id: string}) {
  if (!id) {
    throw new Error('Order id is required');
  }

  const PaypalClient = PayPalHttpClient();

  const request = new paypal.orders.OrdersCaptureRequest(id);

  let response;
  try {
    response = await PaypalClient.execute(request);
  } catch (err) {
    throw new Error('Cannot capture payment');
  }

  if (!response) {
    throw new Error('Cannot capture payment');
  }

  return response;
}
