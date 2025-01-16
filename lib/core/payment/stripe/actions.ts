import {stripe} from '.';
import Stripe from 'stripe';
import {DEFAULT_CURRENCY_CODE} from '@/constants';
import {formatAmountForStripe} from '@/utils/stripe';

export async function createStripeOrder({
  customer,
  currency = DEFAULT_CURRENCY_CODE,
  name,
  amount,
  url,
}: {
  customer: {email: string; id: string};
  currency: string;
  name: string;
  amount: string;
  url: {
    success: string;
    error: string;
  };
}) {
  if (
    !(
      name &&
      amount &&
      customer?.email &&
      currency &&
      url?.success &&
      url?.error
    )
  ) {
    throw new Error(
      'Name, amount, customer, currency and callback urls are required',
    );
  }

  try {
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        mode: 'payment',
        submit_type: 'pay',
        client_reference_id: customer?.id,
        customer_email: customer?.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              product_data: {name},
              unit_amount: formatAmountForStripe(Number(amount || 0), currency),
            },
          },
        ],
        success_url: url.success,
        cancel_url: url.error,
      });

    return session;
  } catch (err) {
    throw new Error('Error processing payment. Try again.');
  }
}

export async function findStripeOrder({id}: {id: string}) {
  if (!id) {
    throw new Error('Session id is required');
  }

  let stripeSession;

  try {
    stripeSession = await stripe.checkout.sessions.retrieve(id);
  } catch (err) {
    throw new Error('Error retrieving payment');
  }

  if (!stripeSession) {
    throw new Error('Payment not found');
  }

  if (
    !(
      (stripeSession.status as string) === 'complete' &&
      stripeSession.payment_status === 'paid'
    )
  ) {
    throw new Error('Payment not successfull');
  }

  let lineItems;
  try {
    lineItems = await stripe.checkout.sessions.listLineItems(id);
  } catch (err) {
    throw new Error('Error retrieving payment details');
  }

  if (!lineItems) {
    throw new Error('Payment details not found');
  }

  return {
    session: stripeSession,
    lines: lineItems,
  };
}
