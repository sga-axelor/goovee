'use server';

import axios from 'axios';
import paypal from '@paypal/checkout-server-sdk';
import type {Stripe} from 'stripe';

// ---- CORE IMPORTS ---- //
import {
  findDefaultDeliveryAddress,
  findDefaultInvoicingAddress,
  findPartnerAddress,
} from '@/orm/address';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';
import paypalhttpclient from '@/lib/paypal';
import {DEFAULT_CURRENCY_CODE, SUBAPP_CODES} from '@/constants';
import {computeTotal} from '@/utils/cart';
import {stripe} from '@/lib/stripe';
import type {ID} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findProduct} from '@/subapps/shop/common/orm/product';
import {formatAmountForStripe} from '@/subapps/shop/common/utils';
import {findPartnerByEmail} from '@/orm/partner';

export async function findInvoicingAddress() {
  const session = await getSession();
  const user = session?.user;

  if (!user) return null;

  return findDefaultInvoicingAddress(user.id).then(clone);
}

export async function findDeliveryAddress() {
  const session = await getSession();
  const user = session?.user;

  if (!user) return null;

  return findDefaultDeliveryAddress(user.id).then(clone);
}

export async function findAddress(id: ID) {
  const session = await getSession();
  const user = session?.user;

  if (!user) return null;

  return findPartnerAddress(id).then(clone);
}

export async function createOrder({
  cart,
  workspaceURL,
}: {
  cart: any;
  workspaceURL: string;
}) {
  const aos = process.env.NEXT_PUBLIC_AOS_URL;

  if (!aos)
    return {
      error: true,
      message: 'Order creation failed. Webservice not available',
    };

  if (!cart?.items?.length) {
    return {
      error: true,
      message: 'Bad request',
    };
  }
  const ws = `${aos}/ws/portal/orders/order`;

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  const workspace = await findWorkspace({
    url: workspaceURL,
    user,
  });

  if (!workspace) {
    return {
      error: true,
      message: 'Invalid workspace',
    };
  }

  try {
    const computedProducts = await Promise.all(
      cart.items.map((i: any) => findProduct({id: i.product, workspace, user})),
    );

    const $cart = {
      ...cart,
      items: [
        ...cart?.items?.map((i: any) => ({
          ...i,
          computedProduct: computedProducts.find(
            cp => Number(cp?.product?.id) === Number(i.product),
          ),
        })),
      ],
    };

    const {total} = computeTotal({cart: $cart, workspace});

    let partnerId, contactId;

    if (user) {
      const {id, isContact, mainPartnerId} = user;
      if (isContact && mainPartnerId) {
        partnerId = mainPartnerId;
        contactId = id;
      } else {
        partnerId = id;
      }
    }

    const payload = {
      partnerId,
      contactId,
      shipping: 0,
      total,
      inAti: workspace?.config?.mainPrice === 'ati',
      items: $cart.items.map((i: any) => {
        const {computedProduct, note, quantity} = i;
        if (!computedProduct) return null;
        const {product, price} = computedProduct;
        return {
          productId: product?.id,
          note: note || '',
          quantity,
          price: price?.ati,
        };
      }),
    };

    const res = await axios.post(ws, payload, {
      auth: {
        username: process.env.BASIC_AUTH_USERNAME as string,
        password: process.env.BASIC_AUTH_PASSWORD as string,
      },
    });

    if (res?.data?.status === -1) {
      return {
        error: true,
        message: 'Error creating order. Try again.',
      };
    }

    return res?.data;
  } catch (err) {
    return {
      error: true,
      message: 'Error creating order. Try again.',
    };
  }
}

export async function paypalCaptureOrder({
  orderId,
  cart,
  workspaceURL,
}: {
  orderId: string;
  cart: any;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  if (!orderId) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!cart?.items?.length) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (!workspace) {
    return {
      error: true,
      message: 'Invalid workspace',
    };
  }

  const hasShopAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: 'Unauthorized',
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

  const {total, currency} = computeTotal({
    cart,
    workspace,
  });

  if (
    Number(purchase?.payments?.captures?.[0]?.amount?.value) !== Number(total)
  ) {
    return {
      error: true,
      message: 'Amount mismatched',
    };
  }

  return createOrder({cart, workspaceURL});
}

export async function paypalCreateOrder({
  cart,
  workspaceURL,
}: {
  cart: any;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  if (!cart?.items?.length) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: 'Invalid workspace',
    };
  }

  const hasShopAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  const {total, currency} = computeTotal({
    cart,
    workspace,
  });

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
          currency_code: currency?.code || 'EUR',
          value: total + '',
        },
      },
    ],
  });

  const response = await PaypalClient.execute(request);

  if (response.statusCode !== 201) {
    return {
      error: true,
      message: 'Error processing payment. Try again',
    };
  }

  return {success: true, order: response?.result};
}

export async function createStripeCheckoutSession({
  cart,
  workspaceURL,
}: {
  cart: any;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  if (!cart?.items?.length) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: 'Invalid workspace',
    };
  }

  const hasShopAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  const {total, currency} = computeTotal({
    cart,
    workspace,
  });

  const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currencyCode,
            product_data: {
              name: 'Cart Checkout',
            },
            unit_amount: formatAmountForStripe(
              Number(total || 0),
              currencyCode,
            ),
          },
        },
      ],
      success_url: `${workspaceURL}/${SUBAPP_CODES.shop}/cart/checkout?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${workspaceURL}/${SUBAPP_CODES.shop}/cart/checkout?stripe_error=true`,
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function validateStripePayment({
  stripeSessionId,
  cart,
  workspaceURL,
}: {
  stripeSessionId: string;
  cart: any;
  workspaceURL: string;
}) {
  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  if (!cart?.items?.length) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: 'Invalid workspace',
    };
  }

  const hasShopAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  if (!stripeSessionId) {
    return {
      error: true,
      message: 'Bad Request',
    };
  }

  const stripeSession =
    await stripe.checkout.sessions.retrieve(stripeSessionId);

  if (!stripeSession) {
    return {
      error: true,
      message: 'Invalid stripe session',
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
      message: 'Payment not successfull',
    };
  }

  const lineItems =
    await stripe.checkout.sessions.listLineItems(stripeSessionId);

  if (!lineItems) {
    return {
      error: true,
      message: 'Payment not successfull',
    };
  }

  const {total, currency} = computeTotal({
    cart,
    workspace,
  });

  const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;

  const stripeTotal = lineItems?.data?.[0]?.amount_total;
  const cartTotal = formatAmountForStripe(Number(total || 0), currencyCode);

  if (stripeTotal && cartTotal && stripeTotal !== cartTotal) {
    return {
      error: true,
      message: 'Payment amount mistmatch',
    };
  }

  return createOrder({cart, workspaceURL});
}
