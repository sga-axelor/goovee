'use server';

import {headers} from 'next/headers';
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
import {clone, scale} from '@/utils';
import {TENANT_HEADER} from '@/middleware';
import {manager} from '@/tenant';
import {findByID} from '@/orm/record';

// ---- LOCAL IMPORTS ---- //
import {getWhereClause} from '@/subapps/quotations/common/utils/quotations';
import {findQuotation} from '@/subapps/quotations/common/orm/quotations';

export async function confirmQuotation({
  workspaceURL,
  quotationId,
}: {
  workspaceURL: string;
  quotationId: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!(workspaceURL && quotationId && tenantId)) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

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

  const {role, isContactAdmin} = subapp;

  const where = getWhereClause({
    user,
    role,
    isContactAdmin,
  });

  const quotation = await findQuotation({
    id: quotationId,
    tenantId,
    params: {where},
    workspaceURL,
  });

  if (!quotation) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  /**
   * TODO
   *
   * Convert to order
   */

  return {
    success: true,
    order: {id: quotationId},
  };
}

export async function paypalCaptureOrder({
  orderId,
  quotation,
  workspaceURL,
}: {
  orderId: string;
  quotation: any;
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

  if (!(orderId && workspaceURL && quotation && tenantId)) {
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

  const hasQuotationAccess = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasQuotationAccess) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  if (!workspace?.config?.payQuotationToConfirm) {
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

  if (
    Number(purchase?.payments?.captures?.[0]?.amount?.value) !==
    Number(
      scale(
        Number(quotation?.inTaxTotal),
        quotation?.currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE,
      ),
    )
  ) {
    return {
      error: true,
      message: 'Amount mismatched',
    };
  }

  /**
   * TODO
   *
   * Convert to order
   */

  return {
    success: true,
    order: quotation,
  };
}

export async function paypalCreateOrder({
  quotation,
  workspaceURL,
}: {
  quotation: any;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  if (!quotation) {
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!(workspaceURL && tenantId)) {
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

  const hasQuotationAccess = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasQuotationAccess) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  if (!workspace?.config?.payQuotationToConfirm) {
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
          currency_code: quotation?.currency?.code || DEFAULT_CURRENCY_CODE,
          value:
            scale(
              Number(quotation?.inTaxTotal),
              quotation?.currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE,
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
  quotation,
  workspaceURL,
}: {
  quotation: any;
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

  if (!(quotation && workspaceURL && tenantId)) {
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

  const hasQuotationAccess = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasQuotationAccess) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  if (!workspace?.config?.payQuotationToConfirm) {
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

  const payer = await findPartnerByEmail(user.email, tenantId);

  const currencyCode = quotation?.currency?.code || DEFAULT_CURRENCY_CODE;

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
              Number(quotation.inTaxTotal || 0),
              currencyCode,
            ),
          },
        },
      ],
      success_url: `${workspaceURL}/${SUBAPP_CODES.quotations}/${quotation.id}?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${workspaceURL}/${SUBAPP_CODES.quotations}/${quotation.id}?stripe_error=true`,
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function validateStripePayment({
  stripeSessionId,
  quotation,
  workspaceURL,
}: {
  stripeSessionId: string;
  quotation: any;
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

  if (!(quotation && workspaceURL && tenantId)) {
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

  const hasQuotationAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasQuotationAccess) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  if (!workspace?.config?.payQuotationToConfirm) {
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

  const currencyCode = quotation?.currency?.code || DEFAULT_CURRENCY_CODE;

  const stripeTotal = lineItems?.data?.[0]?.amount_total;
  const cartTotal = formatAmountForStripe(
    Number(quotation?.inTaxTotal || 0),
    currencyCode,
  );

  if (stripeTotal && cartTotal && stripeTotal !== cartTotal) {
    return {
      error: true,
      message: await getTranslation('Payment amount mistmatch'),
    };
  }

  /**
   * TODO
   *
   * Convert to order
   */

  return {
    success: true,
    order: quotation,
  };
}

export async function confirmAddresses({
  workspaceURL,
  record,
  subAppCode,
}: {
  workspaceURL: string;
  record: any;
  subAppCode: SUBAPP_CODES;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!workspaceURL) {
    return {
      error: true,
      message: await getTranslation('Workspace not provided.'),
    };
  }

  if (!tenantId) {
    return {
      error: true,
      message: await getTranslation('Bad request.'),
    };
  }

  if (!record) {
    return {
      error: true,
      message: await getTranslation('Invalid record.'),
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const user = session.user;

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
    code: subAppCode,
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

  const {
    error,
    message,
    data: modelRecord,
  }: any = await findByID({
    subapp: subapp.code,
    id: record.id,
    workspaceURL,
    workspace,
    tenantId,
    withAuth: false,
  });

  if (error) {
    return {
      error: true,
      message: await getTranslation(message || 'Record not found.'),
    };
  }

  try {
    const reqBody = {
      id: modelRecord.id,
      version: modelRecord.version,
      mainInvoicingAddressStr: record.mainInvoicingAddress.formattedFullName,
      mainInvoicingAddress: {
        select: {
          id: record.mainInvoicingAddress.id,
        },
      },
      deliveryAddressStr: record.deliveryAddress.formattedFullName,
      deliveryAddress: {
        select: {
          id: record.deliveryAddress.id,
        },
      },
    };

    const client = await manager.getClient(tenantId);
    const result = await client.aOSOrder
      .update({data: reqBody})
      .then(clone)
      .catch(error => {
        console.log('Error >>>', error);
      });
    return {success: true, data: result};
  } catch (error) {
    return {
      error: true,
      message: await getTranslation(
        'Something went wrong while saving address!',
      ),
    };
  }
}
