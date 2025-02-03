'use server';

import axios from 'axios';
import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {getSession} from '@/auth';
// import {DEFAULT_CURRENCY_CODE, SUBAPP_CODES} from '@/constants';
import {t} from '@/locale/server';
// import {formatAmountForStripe} from '@/utils/stripe';
import {TENANT_HEADER} from '@/middleware';
import {manager, type Tenant} from '@/tenant';
import {findEventParticipant} from '../orm/registration';
import {findEvent} from '../orm/event';
// import {PaymentOption} from '@/types';
// import {createPaypalOrder, findPaypalOrder} from '@/payment/paypal/actions';
// import {createStripeOrder, findStripeOrder} from '@/payment/stripe/actions';

export async function createInvoice({
  workspaceURL,
  tenantId,
  mainParticipantId,
  eventId,
}: {
  workspaceURL: string;
  tenantId: Tenant['id'];
  mainParticipantId: string | number;
  eventId: string | number;
}) {
  if (!eventId) return {error: true, message: await t('Event ID is missing!')};
  if (!mainParticipantId)
    return {
      error: true,
      message: await t('Participant id is missing!'),
    };

  const tenant = await manager.getTenant(tenantId);

  if (!tenant?.config?.aos?.url) {
    return {
      error: true,
      message: await t('Invoice creation failed. Webservice not available'),
    };
  }

  const {aos} = tenant.config;

  const ws = `${aos.url}/ws/portal/invoice/eventInvoice`;

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({
    url: workspaceURL,
    user,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }

  const event = await findEvent({
    id: eventId,
    workspace,
    tenantId,
    user,
  });

  if (!event) {
    return {
      error: true,
      message: await t('Event not found.'),
    };
  }

  console.log('event >>>', event);

  // return;

  const participant = await findEventParticipant({
    id: mainParticipantId,
    workspace,
    tenantId,
  });
  if (!participant) {
    return {
      error: true,
      message: await t('Participant not found.'),
    };
  }

  try {
    const registrationtId = 1;
    const totalAmount = 100;
    let mainParticipantId;

    if (user) {
      const {id, isContact, mainPartnerId} = user;
      if (isContact && mainPartnerId) {
        mainParticipantId = id;
      } else {
        mainParticipantId = id;
      }
    }
    mainParticipantId; // generated main participant id

    const payload = {
      partnerWorkspaceId: workspace.id,
      registrationId: registrationtId,
      participantId: mainParticipantId,
      totalAmount: totalAmount,
    };

    console.log('payload >>>', payload);
    const res = await axios.post(ws, payload, {
      auth: {
        username: aos.auth.username,
        password: aos.auth.password,
      },
    });

    if (res?.data?.status === -1) {
      return {
        error: true,
        message: await t('Error creating order. Try again.'),
      };
    }

    return res?.data;
  } catch (err) {
    return {
      error: true,
      message: await t('Error creating order. Try again.'),
    };
  }
}
// export async function paypalCaptureOrder({
//   orderId,
//   cart,
//   workspaceURL,
// }: {
//   orderId: string;
//   cart: any;
//   workspaceURL: string;
// }) {
//   const session = await getSession();

//   if (!session) {
//     return {
//       error: true,
//       message: await t('Unauthorized'),
//     };
//   }

//   if (!orderId) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   if (!workspaceURL) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   const user = session?.user;

//   const tenantId = headers().get(TENANT_HEADER);

//   if (!tenantId) {
//     return {
//       error: true,
//       message: await t('Invalid tenant'),
//     };
//   }

//   const workspace = await findWorkspace({
//     user,
//     url: workspaceURL,
//     tenantId,
//   });

//   if (!workspace) {
//     return {
//       error: true,
//       message: await t('Invalid workspace'),
//     };
//   }

//   const hasShopAccess = await findSubappAccess({
//     code: SUBAPP_CODES.shop,
//     user,
//     url: workspace.url,
//     tenantId,
//   });

//   if (!hasShopAccess) {
//     return {
//       error: true,
//       message: 'Unauthorized',
//     };
//   }

//   if (!workspace?.config?.confirmOrder) {
//     return {
//       error: true,
//       message: await t('Not allowed'),
//     };
//   }

//   if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
//     return {
//       error: true,
//       message: await t('Online payment is not available'),
//     };
//   }

//   const allowPaypal = workspace?.config?.paymentOptionSet?.find(
//     (o: any) => o?.typeSelect === PaymentOption.paypal,
//   );

//   if (!allowPaypal) {
//     return {
//       error: true,
//       message: await t('Paypal is not available'),
//     };
//   }

//   try {
//     const response = await findPaypalOrder({id: orderId});

//     const {result} = response;

//     const purchase = result?.purchase_units?.[0];

//     const {total} = computeTotal({cart, workspace});

//     if (
//       Number(purchase?.payments?.captures?.[0]?.amount?.value) !== Number(total)
//     ) {
//       return {
//         error: true,
//         message: 'Amount mismatched',
//       };
//     }

//     return createOrder({cart, workspaceURL, tenantId});
//   } catch (err) {
//     return {
//       error: true,
//       message: await t((err as any)?.message),
//     };
//   }
// }

// export async function paypalCreateOrder({
//   cart,
//   workspaceURL,
// }: {
//   cart: any;
//   workspaceURL: string;
// }) {
//   const session = await getSession();

//   if (!session) {
//     return {
//       error: true,
//       message: await t('Unauthorized'),
//     };
//   }

//   if (!cart?.items?.length) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   if (!workspaceURL) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   const tenantId = headers().get(TENANT_HEADER);

//   if (!tenantId) {
//     return {
//       error: true,
//       message: await t('Invalid tenant'),
//     };
//   }

//   const user = session?.user;

//   const workspace = await findWorkspace({
//     user,
//     url: workspaceURL,
//     tenantId,
//   });

//   if (!workspace) {
//     return {
//       error: true,
//       message: await t('Invalid workspace'),
//     };
//   }

//   const hasShopAccess = await findSubappAccess({
//     code: SUBAPP_CODES.shop,
//     user,
//     url: workspace.url,
//     tenantId,
//   });

//   if (!hasShopAccess) {
//     return {
//       error: true,
//       message: await t('Unauthorized'),
//     };
//   }

//   if (!workspace?.config?.confirmOrder) {
//     return {
//       error: true,
//       message: await t('Not allowed'),
//     };
//   }

//   if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
//     return {
//       error: true,
//       message: await t('Online payment is not available'),
//     };
//   }

//   const allowPaypal = workspace?.config?.paymentOptionSet?.find(
//     (o: any) => o?.typeSelect === PaymentOption.paypal,
//   );

//   if (!allowPaypal) {
//     return {
//       error: true,
//       message: await t('Paypal is not available'),
//     };
//   }

//   const {total, currency} = computeTotal({
//     cart,
//     workspace,
//   });

//   const payer = await findPartnerByEmail(user?.email, tenantId);

//   try {
//     const response = await createPaypalOrder({
//       amount: total,
//       currency: currency?.code,
//       email: payer?.emailAddress?.address,
//     });

//     return {success: true, order: response?.result};
//   } catch (err) {
//     return {
//       error: true,
//       message: await t((err as any)?.message),
//     };
//   }
// }

// export async function createStripeCheckoutSession({
//   cart,
//   workspaceURL,
// }: {
//   cart: any;
//   workspaceURL: string;
// }) {
//   const session = await getSession();

//   if (!session) {
//     return {
//       error: true,
//       message: await t('Unauthorized'),
//     };
//   }

//   if (!cart?.items?.length) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   if (!workspaceURL) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   const tenantId = headers().get(TENANT_HEADER);

//   if (!tenantId) {
//     return {
//       error: true,
//       message: await t('Invalid tenant'),
//     };
//   }

//   const user = session?.user;

//   const workspace = await findWorkspace({
//     user,
//     url: workspaceURL,
//     tenantId,
//   });

//   if (!workspace) {
//     return {
//       error: true,
//       message: await t('Invalid workspace'),
//     };
//   }

//   const hasShopAccess = await findSubappAccess({
//     code: SUBAPP_CODES.shop,
//     user,
//     url: workspace.url,
//     tenantId,
//   });

//   if (!hasShopAccess) {
//     return {
//       error: true,
//       message: await t('Unauthorized'),
//     };
//   }

//   if (!workspace?.config?.confirmOrder) {
//     return {
//       error: true,
//       message: await t('Not allowed'),
//     };
//   }

//   if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
//     return {
//       error: true,
//       message: await t('Online payment is not available'),
//     };
//   }

//   const allowStripe = workspace?.config?.paymentOptionSet?.find(
//     (o: any) => o?.typeSelect === PaymentOption.stripe,
//   );

//   if (!allowStripe) {
//     return {
//       error: true,
//       message: await t('Stripe is not available'),
//     };
//   }

//   const {total, currency} = computeTotal({
//     cart,
//     workspace,
//   });

//   const payer = await findPartnerByEmail(user.email, tenantId);

//   const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;

//   try {
//     const session = await createStripeOrder({
//       customer: {
//         id: payer?.id!,
//         email: payer?.emailAddress?.address!,
//       },
//       name: 'Cart Checkout',
//       amount: total as string,
//       currency: currencyCode,
//       url: {
//         success: `${workspaceURL}/${SUBAPP_CODES.shop}/cart/checkout?stripe_session_id={CHECKOUT_SESSION_ID}`,
//         error: `${workspaceURL}/${SUBAPP_CODES.shop}/cart/checkout?stripe_error=true`,
//       },
//     });

//     return {
//       client_secret: session.client_secret,
//       url: session.url,
//     };
//   } catch (err) {
//     return {
//       error: true,
//       message: await t((err as any)?.message),
//     };
//   }
// }

// export async function validateStripePayment({
//   stripeSessionId,
//   cart,
//   workspaceURL,
// }: {
//   stripeSessionId: string;
//   cart: any;
//   workspaceURL: string;
// }) {
//   const session = await getSession();

//   if (!session) {
//     return {
//       error: true,
//       message: await t('Unauthorized'),
//     };
//   }

//   if (!cart?.items?.length) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   if (!workspaceURL) {
//     return {
//       error: true,
//       message: await t('Bad request'),
//     };
//   }

//   const user = session?.user;

//   const tenantId = headers().get(TENANT_HEADER);

//   if (!tenantId) {
//     return {
//       error: true,
//       message: await t('Invalid tenant'),
//     };
//   }

//   const workspace = await findWorkspace({
//     user,
//     url: workspaceURL,
//     tenantId,
//   });

//   if (!workspace) {
//     return {
//       error: true,
//       message: await t('Invalid workspace'),
//     };
//   }

//   const hasShopAccess = await findSubappAccess({
//     code: SUBAPP_CODES.shop,
//     user,
//     url: workspace.url,
//     tenantId,
//   });

//   if (!hasShopAccess) {
//     return {
//       error: true,
//       message: await t('Unauthorized'),
//     };
//   }

//   if (!workspace?.config?.confirmOrder) {
//     return {
//       error: true,
//       message: await t('Not allowed'),
//     };
//   }

//   if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
//     return {
//       error: true,
//       message: await t('Online payment is not available'),
//     };
//   }

//   const allowStripe = workspace?.config?.paymentOptionSet?.find(
//     (o: any) => o?.typeSelect === PaymentOption.stripe,
//   );

//   if (!allowStripe) {
//     return {
//       error: true,
//       message: await t('Stripe is not available'),
//     };
//   }

//   if (!stripeSessionId) {
//     return {
//       error: true,
//       message: await t('Bad Request'),
//     };
//   }

//   let stripeSession;
//   try {
//     stripeSession = await findStripeOrder({id: stripeSessionId});
//   } catch (err) {
//     return {
//       error: true,
//       message: await t((err as any)?.message),
//     };
//   }

//   const {total, currency} = computeTotal({
//     cart,
//     workspace,
//   });

//   const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;

//   const paymentTotal = stripeSession?.lines?.data?.[0]?.amount_total;
//   const cartTotal = formatAmountForStripe(Number(total || 0), currencyCode);

//   if (paymentTotal && cartTotal && paymentTotal !== cartTotal) {
//     return {
//       error: true,
//       message: await t('Payment amount mistmatch'),
//     };
//   }

//   return createOrder({cart, workspaceURL, tenantId});
// }
