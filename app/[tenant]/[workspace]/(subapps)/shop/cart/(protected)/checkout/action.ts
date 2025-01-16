'use server';

import axios from 'axios';
import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {getSession} from '@/auth';
import {DEFAULT_CURRENCY_CODE, SUBAPP_CODES} from '@/constants';
import {computeTotal} from '@/utils/cart';
import {t} from '@/locale/server';
import {formatAmountForStripe} from '@/utils/stripe';
import {TENANT_HEADER} from '@/middleware';
import {manager, type Tenant} from '@/tenant';
import {PaymentOption} from '@/types';
import {createPaypalOrder, findPaypalOrder} from '@/payment/paypal/actions';
import {createStripeOrder, findStripeOrder} from '@/payment/stripe/actions';

// ---- LOCAL IMPORTS ---- //
import {findProduct} from '@/subapps/shop/common/orm/product';
import {findPartnerByEmail} from '@/orm/partner';

export async function createOrder({
  cart,
  workspaceURL,
  tenantId,
}: {
  cart: any;
  workspaceURL: string;
  tenantId: Tenant['id'];
}) {
  if (!cart?.items?.length) {
    return {
      error: true,
      message: 'Bad request',
    };
  }

  const tenant = await manager.getTenant(tenantId);

  if (!tenant?.config?.aos?.url) {
    return {
      error: true,
      message: 'Order creation failed. Webservice not available',
    };
  }

  const {aos} = tenant.config;

  const ws = `${aos.url}/ws/portal/orders/order`;

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
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: 'Invalid workspace',
    };
  }

  try {
    const computedProducts = await Promise.all(
      cart.items.map((i: any) =>
        findProduct({id: i.product, workspace, user, tenantId}),
      ),
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
      workspaceId: workspace.id,
    };

    const res = await axios.post(ws, payload, {
      auth: {
        username: aos.auth.username,
        password: aos.auth.password,
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

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Invalid tenant'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
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
    tenantId,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  if (!workspace?.config?.confirmOrder) {
    return {
      error: true,
      message: await t('Not allowed'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await t('Online payment is not available'),
    };
  }

  const allowPaypal = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.paypal,
  );

  if (!allowPaypal) {
    return {
      error: true,
      message: await t('Paypal is not available'),
    };
  }

  try {
    const response = await findPaypalOrder({id: orderId});

    const {result} = response;

    const purchase = result?.purchase_units?.[0];

    const {total} = computeTotal({cart, workspace});

    if (
      Number(purchase?.payments?.captures?.[0]?.amount?.value) !== Number(total)
    ) {
      return {
        error: true,
        message: 'Amount mismatched',
      };
    }

    return createOrder({cart, workspaceURL, tenantId});
  } catch (err) {
    return {
      error: true,
      message: await t((err as any)?.message),
    };
  }
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
      message: await t('Unauthorized'),
    };
  }

  if (!cart?.items?.length) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Invalid tenant'),
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
      message: await t('Invalid workspace'),
    };
  }

  const hasShopAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  if (!workspace?.config?.confirmOrder) {
    return {
      error: true,
      message: await t('Not allowed'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await t('Online payment is not available'),
    };
  }

  const allowPaypal = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.paypal,
  );

  if (!allowPaypal) {
    return {
      error: true,
      message: await t('Paypal is not available'),
    };
  }

  const {total, currency} = computeTotal({
    cart,
    workspace,
  });

  const payer = await findPartnerByEmail(user?.email, tenantId);

  try {
    const response = await createPaypalOrder({
      amount: total,
      currency: currency?.code,
      email: payer?.emailAddress?.address,
    });

    return {success: true, order: response?.result};
  } catch (err) {
    return {
      error: true,
      message: await t((err as any)?.message),
    };
  }
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
      message: await t('Unauthorized'),
    };
  }

  if (!cart?.items?.length) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Invalid tenant'),
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
      message: await t('Invalid workspace'),
    };
  }

  const hasShopAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  if (!workspace?.config?.confirmOrder) {
    return {
      error: true,
      message: await t('Not allowed'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await t('Online payment is not available'),
    };
  }

  const allowStripe = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.stripe,
  );

  if (!allowStripe) {
    return {
      error: true,
      message: await t('Stripe is not available'),
    };
  }

  const {total, currency} = computeTotal({
    cart,
    workspace,
  });

  const payer = await findPartnerByEmail(user.email, tenantId);

  const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;

  try {
    const session = await createStripeOrder({
      customer: {
        id: payer?.id!,
        email: payer?.emailAddress?.address!,
      },
      name: 'Cart Checkout',
      amount: total as string,
      currency: currencyCode,
      url: {
        success: `${workspaceURL}/${SUBAPP_CODES.shop}/cart/checkout?stripe_session_id={CHECKOUT_SESSION_ID}`,
        error: `${workspaceURL}/${SUBAPP_CODES.shop}/cart/checkout?stripe_error=true`,
      },
    });

    return {
      client_secret: session.client_secret,
      url: session.url,
    };
  } catch (err) {
    return {
      error: true,
      message: await t((err as any)?.message),
    };
  }
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
      message: await t('Unauthorized'),
    };
  }

  if (!cart?.items?.length) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Invalid tenant'),
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
      message: await t('Invalid workspace'),
    };
  }

  const hasShopAccess = await findSubappAccess({
    code: SUBAPP_CODES.shop,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasShopAccess) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  if (!workspace?.config?.confirmOrder) {
    return {
      error: true,
      message: await t('Not allowed'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return {
      error: true,
      message: await t('Online payment is not available'),
    };
  }

  const allowStripe = workspace?.config?.paymentOptionSet?.find(
    (o: any) => o?.typeSelect === PaymentOption.stripe,
  );

  if (!allowStripe) {
    return {
      error: true,
      message: await t('Stripe is not available'),
    };
  }

  if (!stripeSessionId) {
    return {
      error: true,
      message: await t('Bad Request'),
    };
  }

  let stripeSession;
  try {
    stripeSession = await findStripeOrder({id: stripeSessionId});
  } catch (err) {
    return {
      error: true,
      message: await t((err as any)?.message),
    };
  }

  const {total, currency} = computeTotal({
    cart,
    workspace,
  });

  const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;

  const paymentTotal = stripeSession?.lines?.data?.[0]?.amount_total;
  const cartTotal = formatAmountForStripe(Number(total || 0), currencyCode);

  if (paymentTotal && cartTotal && paymentTotal !== cartTotal) {
    return {
      error: true,
      message: await t('Payment amount mistmatch'),
    };
  }

  return createOrder({cart, workspaceURL, tenantId});
}
