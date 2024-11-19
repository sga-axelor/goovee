'use server';

import paypal from '@paypal/checkout-server-sdk';
import type {Stripe} from 'stripe';

// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_CURRENCY_SCALE,
  SUBAPP_CODES,
} from '@/constants';
import paypalhttpclient from '@/payment/paypal';
import {stripe} from '@/payment/stripe';
import {PaymentOption} from '@/types';
import {findPartnerByEmail} from '@/orm/partner';
import {formatAmountForStripe} from '@/utils/stripe';
import {scale} from '@/utils';
import {TENANT_HEADER} from '@/middleware';

// ---- LOCAL IMPORTS ---- //
import {getWhereClause} from '@/subapps/invoices/common/utils/invoices';
import {findInvoice} from '@/subapps/invoices/common/orm/invoices';
import {headers} from 'next/headers';

export async function paypalCaptureOrder({
  orderId,
  invoice,
  workspaceURL,
}: {
  orderId: string;
  invoice: any;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!(orderId && workspaceURL && invoice && tenantId)) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: 'Invalid workspace',
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  const {id, isContact, mainPartnerId} = user;
  const {role} = subapp;

  const $invoice = await findInvoice({
    id,
    params: {
      where: getWhereClause(isContact, role, id, mainPartnerId),
    },
    tenantId,
  });

  if (!$invoice) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (workspace?.config?.canPayInvoice === 'no') {
    return {
      error: true,
      message: await getTranslation('Not allowed'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await getTranslation('Online payment is not available'),
    };
  }

  const allowPaypal = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.paypal,
  );

  if (!allowPaypal) {
    return {
      error: true,
      message: await getTranslation('Paypal is not available'),
    };
  }

  const PaypalClient = paypalhttpclient();

  const request = new paypal.orders.OrdersCaptureRequest(orderId);

  const response = await PaypalClient.execute(request);

  if (!response) {
    return {
      error: true,
      message: 'Error processing payment. Try again.',
    };
  }

  const {result} = response;

  const purchase = result?.purchase_units?.[0];
  const purchaseAmount = Number(
    purchase?.payments?.captures?.[0]?.amount?.value,
  );

  let remainingAmount = Number(
    scale(
      Number($invoice?.amountRemaining?.value),
      $invoice?.currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE,
    ),
  );

  if (
    workspace?.config?.canPayInvoice === 'total' &&
    purchaseAmount !== remainingAmount
  ) {
    return {
      error: true,
      message: 'Amount mismatched',
    };
  } else if (
    workspace?.config?.canPayInvoice === 'partial' &&
    remainingAmount > purchaseAmount
  ) {
    return {
      error: true,
      message: 'Amount mismatched',
    };
  }

  /**
   * TODO
   *
   * Update invoice
   */

  return {
    success: true,
    invoice: $invoice,
  };
}

export async function paypalCreateOrder({
  invoice,
  amount,
  workspaceURL,
}: {
  invoice: any;
  amount: string;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!(invoice && tenantId)) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await getTranslation('Invalid workspace'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const {id, isContact, mainPartnerId} = user;
  const {role} = subapp;

  const $invoice = await findInvoice({
    id,
    params: {
      where: getWhereClause(isContact, role, id, mainPartnerId),
    },
    tenantId,
  });

  if (!$invoice) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (workspace?.config?.canPayInvoice === 'no') {
    return {
      error: true,
      message: await getTranslation('Not allowed'),
    };
  }

  if (
    workspace?.config?.canPayInvoice === 'total' &&
    amount !== $invoice?.amountRemaining?.value
  ) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await getTranslation('Online payment is not available'),
    };
  }

  const allowPaypal = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.paypal,
  );

  if (!allowPaypal) {
    return {
      error: true,
      message: await getTranslation('Paypal is not available'),
    };
  }

  const payer = await findPartnerByEmail(user?.email, tenantId);

  const PaypalClient = paypalhttpclient();

  const request = new paypal.orders.OrdersCreateRequest();

  request.headers['Prefer'] = 'return=representation';

  request.requestBody({
    intent: 'CAPTURE',
    payer: {
      email_address: payer?.emailAddress?.address,
    } as any,
    purchase_units: [
      {
        amount: {
          currency_code: $invoice?.currency?.code || DEFAULT_CURRENCY_CODE,
          value:
            scale(
              Number(amount),
              $invoice?.currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE,
            ) + '',
        },
      },
    ],
  });

  try {
    const response = await PaypalClient.execute(request);
    if (response.statusCode !== 201) {
      return {
        error: true,
        message: await getTranslation('Error processing payment. Try again'),
      };
    }

    return {success: true, order: response?.result};
  } catch (err) {
    return {
      error: true,
      message: await getTranslation('Error processing payment. Try again'),
    };
  }
}

export async function createStripeCheckoutSession({
  invoice,
  amount,
  workspaceURL,
}: {
  invoice: any;
  amount: string;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!(invoice && workspaceURL && tenantId)) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await getTranslation('Invalid workspace'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const {id, isContact, mainPartnerId} = user;
  const {role} = subapp;

  const $invoice = await findInvoice({
    id,
    params: {
      where: getWhereClause(isContact, role, id, mainPartnerId),
    },
    tenantId,
  });

  if (!$invoice) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (workspace?.config?.canPayInvoice === 'no') {
    return {
      error: true,
      message: await getTranslation('Not allowed'),
    };
  }

  if (
    workspace?.config?.canPayInvoice === 'total' &&
    amount !== $invoice?.amountRemaining?.value
  ) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  } else if (
    workspace?.config?.canPayInvoice === 'partial' &&
    amount > $invoice?.amountRemaining?.value
  ) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await getTranslation('Online payment is not available'),
    };
  }

  const allowStripe = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.stripe,
  );

  if (!allowStripe) {
    return {
      error: true,
      message: await getTranslation('Stripe is not available'),
    };
  }

  const payer = await findPartnerByEmail(user.email, tenantId);

  const currencyCode = $invoice?.currency?.code || DEFAULT_CURRENCY_CODE;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      client_reference_id: payer?.id,
      customer_email: payer?.emailAddress?.address,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currencyCode,
            product_data: {
              name: 'Cart Checkout',
            },
            unit_amount: formatAmountForStripe(
              Number(amount || 0),
              currencyCode,
            ),
          },
        },
      ],
      success_url: `${workspaceURL}/${SUBAPP_CODES.invoices}/${invoice.id}?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${workspaceURL}/${SUBAPP_CODES.invoices}/${invoice.id}?stripe_error=true`,
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function validateStripePayment({
  stripeSessionId,
  invoice,
  workspaceURL,
}: {
  stripeSessionId: string;
  invoice: any;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!(invoice && workspaceURL && tenantId)) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await getTranslation('Invalid workspace'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const {id, isContact, mainPartnerId} = user;
  const {role} = subapp;

  const $invoice = await findInvoice({
    id,
    params: {
      where: getWhereClause(isContact, role, id, mainPartnerId),
    },
    tenantId,
  });

  if (!$invoice) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (workspace?.config?.canPayInvoice === 'no') {
    return {
      error: true,
      message: await getTranslation('Not allowed'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await getTranslation('Online payment is not available'),
    };
  }

  const allowStripe = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.stripe,
  );

  if (!allowStripe) {
    return {
      error: true,
      message: await getTranslation('Stripe is not available'),
    };
  }

  if (!stripeSessionId) {
    return {
      error: true,
      message: await getTranslation('Bad Request'),
    };
  }

  const stripeSession =
    await stripe.checkout.sessions.retrieve(stripeSessionId);

  if (!stripeSession) {
    return {
      error: true,
      message: await getTranslation('Invalid stripe session'),
    };
  }

  if (
    !(
      (stripeSession.status as string) === 'complete' &&
      stripeSession.payment_status === 'paid'
    )
  ) {
    return {
      error: true,
      message: await getTranslation('Payment not successfull'),
    };
  }

  const lineItems =
    await stripe.checkout.sessions.listLineItems(stripeSessionId);

  if (!lineItems) {
    return {
      error: true,
      message: await getTranslation('Payment not successfull'),
    };
  }

  const currencyCode = $invoice?.currency?.code || DEFAULT_CURRENCY_CODE;

  const stripeTotal = lineItems?.data?.[0]?.amount_total;

  const cartTotal = formatAmountForStripe(
    Number($invoice?.amountRemaining?.value || 0),
    currencyCode,
  );

  if (
    workspace?.config?.canPayInvoice === 'total' &&
    stripeTotal &&
    cartTotal &&
    stripeTotal !== cartTotal
  ) {
    return {
      error: true,
      message: 'Amount mismatched',
    };
  } else if (
    workspace?.config?.canPayInvoice === 'partial' &&
    Number(stripeTotal) > Number($invoice?.amountRemaining?.value)
  ) {
    return {
      error: true,
      message: 'Amount mismatched',
    };
  }

  /**
   * TODO
   *
   * Update invoice
   */

  return {
    success: true,
    invoice: $invoice,
  };
}
