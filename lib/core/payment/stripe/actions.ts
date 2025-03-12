import {stripe} from '.';
import Stripe from 'stripe';
import {DEFAULT_CURRENCY_CODE} from '@/constants';
import {formatAmountForStripe, getAmountFromStripe} from '@/utils/stripe';
import {findPaymentContext, createPaymentContext} from '../common/orm';
import {PaymentOption} from '@/types';
import type {Tenant} from '@/tenant';
import type {PaymentOrder} from '../common/type';

export async function createStripeOrder({
  customer,
  currency = DEFAULT_CURRENCY_CODE,
  name,
  amount,
  url,
  context,
  tenantId,
}: {
  tenantId: Tenant['id'];
  customer: {email: string; id: string};
  currency: string;
  name: string;
  amount: number;
  url: {
    success: string;
    error: string;
  };
  context: Record<string, any>;
}) {
  if (
    !(
      tenantId &&
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
    const {id: contextId} = await createPaymentContext({
      context,
      mode: PaymentOption.stripe,
      payer: customer.email,
      tenantId,
    });

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        mode: 'payment',
        submit_type: 'pay',
        client_reference_id: customer?.id,
        customer_email: customer?.email,
        metadata: {context_id: contextId},
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              product_data: {name},
              unit_amount: formatAmountForStripe(amount, currency),
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

export async function findStripeOrder({
  id,
  tenantId,
}: {
  id: string;
  tenantId: Tenant['id'];
}): Promise<PaymentOrder> {
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

  const contextId = stripeSession.metadata?.context_id;
  if (!contextId) {
    throw new Error('Context id not found');
  }

  const context = await findPaymentContext({
    id: contextId,
    tenantId,
    mode: PaymentOption.stripe,
  });

  if (!context) {
    throw new Error('Context not found');
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

  const currency = lineItems.data?.[0]?.currency || DEFAULT_CURRENCY_CODE;
  return {
    context,
    amount: getAmountFromStripe(lineItems.data?.[0]?.amount_total, currency),
  };
}
