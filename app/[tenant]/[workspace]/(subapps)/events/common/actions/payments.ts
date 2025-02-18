'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {DEFAULT_CURRENCY_CODE, SUBAPP_CODES} from '@/constants';
import {t} from '@/locale/server';
import {TENANT_HEADER} from '@/middleware';
import {findPartnerByEmail} from '@/orm/partner';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {createPaypalOrder} from '@/payment/paypal/actions';
import {createStripeOrder, findStripeOrder} from '@/payment/stripe/actions';
import {PaymentOption} from '@/types';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {formatAmountForStripe} from '@/utils/stripe';

// ---- LOCAL IMPORTS ---- //
import {register} from '@/subapps/events/common/actions/actions';
import {REQUIRED_FIELDS} from '@/subapps/events/common/constants';
import {findEvent} from '@/subapps/events/common/orm/event';
import {error} from '@/subapps/events/common/utils';
import {createInvoice} from '@/subapps/events/common/utils/invoice';
import {getCalculatedTotalPrice} from '@/subapps/events/common/utils/payments';
import {validateRequiredFormFields} from '@/subapps/events/common/utils/registration';

export async function createStripeCheckoutSession({
  event,
  workspaceURL,
  values,
}: {
  event: {
    id: string | number;
  };
  workspaceURL: string;
  values: any;
}) {
  if (!event?.id) {
    return error(await t('Event ID is missing'));
  }

  if (!Object.keys(values)?.length) {
    return error(await t('Form values are missing'));
  }
  const validationResult = await validateRequiredFormFields(
    values,
    REQUIRED_FIELDS,
    t,
  );
  if (validationResult) {
    return error(validationResult.error);
  }

  if (!workspaceURL) {
    return error(await t('Bad request.'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await t('Invalid tenant.'));
  }

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return error(await t('Invalid workspace.'));
  }

  const hasEventAccess = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user,
    url: workspace.url,
    tenantId,
  });
  if (!hasEventAccess) {
    return error(await t('Unauthorized app access!'));
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return error(await t('Online payment is not available.'));
  }

  const paymentOptionSet = workspace?.config?.paymentOptionSet;
  if (!paymentOptionSet?.length) {
    return error(await t('Payment options are not configured.'));
  }

  const allowStripe = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.stripe,
  );
  if (!allowStripe) {
    return error(await t('Stripe is not available.'));
  }

  const $event = await findEvent({
    id: event.id,
    tenantId,
    workspace,
  });

  if (!$event) {
    return error(await t('Invalid event'));
  }
  const currency = $event.currency;

  const {total: amount} = getCalculatedTotalPrice(values, $event);
  if (!amount || amount <= 0) {
    return error(await t('Total price must be greater than 0.'));
  }

  let emailAddress;
  let payerId;
  if (user) {
    const payer = await findPartnerByEmail(user.email, tenantId);
    emailAddress = payer?.emailAddress?.address!;
    payerId = payer?.id!;
  } else {
    emailAddress = values.emailAddress;
    payerId = values.emailAddress;
  }
  const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;

  try {
    const session = await createStripeOrder({
      customer: {
        id: payerId,
        email: emailAddress,
      },
      name: await t('Event Registration'),
      amount: String(amount) as string,
      currency: currencyCode,
      url: {
        success: `${workspaceURL}/${SUBAPP_CODES.events}/${$event.slug}/register?stripe_session_id={CHECKOUT_SESSION_ID}`,
        error: `${workspaceURL}/${SUBAPP_CODES.events}/${$event.slug}/register?stripe_error=true`,
      },
    });

    return {
      client_secret: session.client_secret,
      url: session.url,
    };
  } catch (err) {
    console.error('Stripe checkout session error:', err);
    return {
      error: true,
      message: await t((err as any)?.message),
    };
  }
}

export async function validateStripePayment({
  stripeSessionId,
  values,
  workspaceURL,
  event,
}: {
  stripeSessionId: string;
  values: any;
  workspaceURL: string;
  event: {
    id: string | number;
  };
}) {
  if (!stripeSessionId) {
    return error(await t('Missing Stripe session ID!'));
  }

  if (!event?.id) {
    return error(await t('Event ID is missing'));
  }

  if (Object.keys(values)?.length === 0) {
    return error(await t('Form values are missing'));
  }

  const validationResult = await validateRequiredFormFields(
    values,
    REQUIRED_FIELDS,
    t,
  );
  if (validationResult) {
    return error(validationResult.error);
  }

  if (!workspaceURL) {
    return error(await t('Workspace not provided!'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await t('Invalid tenant'));
  }

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return error(await t('Invalid workspace'));
  }

  const hasEventsAccess = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasEventsAccess) {
    return error(await t('Unauthorized App access!'));
  }

  const paymentOptionSet = workspace?.config?.paymentOptionSet;
  if (!paymentOptionSet?.length) {
    return error(await t('Payment options are not configured.'));
  }

  const allowStripe = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.stripe,
  );

  if (!allowStripe) {
    return error(await t('Stripe is not available.'));
  }

  const $event = await findEvent({
    id: event.id,
    tenantId,
    workspace,
  });
  if (!$event) {
    return error(await t('Invalid event!'));
  }

  const {total: amount} = getCalculatedTotalPrice(values, $event);
  if (!amount || amount <= 0) {
    return error(await t('Total price must be greater than 0.'));
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return error(await t('Online payment is not available'));
  }

  let stripeSession;
  try {
    stripeSession = await findStripeOrder({id: stripeSessionId});
  } catch (err) {
    return error(await t((err as any)?.message));
  }

  const currencyCode = $event.currency?.code || DEFAULT_CURRENCY_CODE;

  const paymentTotal = stripeSession?.lines?.data?.[0]?.amount_total;
  const eventTotal = formatAmountForStripe(Number(amount || 0), currencyCode);

  if (paymentTotal && eventTotal && paymentTotal !== eventTotal) {
    return error(await t('Payment amount mistmatch'));
  }

  const resgistration = await register({
    eventId: event.id,
    values,
    workspace: {
      url: workspaceURL,
    },
    payment: {
      id: stripeSessionId,
      mode: PaymentOption.stripe,
    },
  });

  if (resgistration.error) {
    return error(
      await t(
        resgistration.message ||
          'Something went wrong while event registration.',
      ),
    );
  }
  const {data} = resgistration;

  const invoiceResult = await createInvoice({
    workspaceURL,
    tenantId,
    registrationId: data.id,
    eventId: $event.id,
  });

  if (invoiceResult?.error) {
    console.error('Invoice error:', invoiceResult.message);
  }

  return {
    success: true,
    data: resgistration.data,
  };
}

export async function paypalCaptureOrder({
  orderID,
  workspaceURL,
  values,
  event,
}: {
  orderID: string;
  workspaceURL: string;
  values: any;
  event: {
    id: string | number;
  };
}) {
  if (!orderID) {
    return error(await t('Order ID is missing'));
  }

  if (Object.keys(values)?.length === 0) {
    return error(await t('Form values are missing'));
  }

  const validationResult = await validateRequiredFormFields(
    values,
    REQUIRED_FIELDS,
    t,
  );
  if (validationResult) {
    return error(validationResult.error);
  }

  if (!event.id) {
    return error(await t('Event ID is missing'));
  }

  if (!workspaceURL) {
    return error(await t('Workspace not provided!'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await t('Invalid tenant'));
  }

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return error(await t('Invalid workspace'));
  }

  const hasEventsAccess = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasEventsAccess) {
    return error(await t('Unauthorized App access!'));
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return error(await t('Online payment is not available'));
  }

  const paymentOptionSet = workspace?.config?.paymentOptionSet;
  if (!paymentOptionSet?.length) {
    return error(await t('Payment options are not configured.'));
  }

  const allowPaypal = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.paypal,
  );

  if (!allowPaypal) {
    return error(await t('Paypal is not available'));
  }

  const $event = await findEvent({
    id: event.id,
    tenantId,
    workspace,
  });
  if (!$event) {
    return error(await t('Invalid event!'));
  }

  const {total: amount} = getCalculatedTotalPrice(values, $event);
  if (!amount || amount <= 0) {
    return error(await t('Total price must be greater than 0.'));
  }

  try {
    const resgistration = await register({
      eventId: $event.id,
      values,
      workspace: {
        url: workspaceURL,
      },
      payment: {
        id: orderID,
        mode: PaymentOption.paypal,
      },
    });

    if (!resgistration || resgistration?.error) {
      return error(
        await t(
          resgistration.message ||
            'Something went wrong while event registration.',
        ),
      );
    }

    const {data} = resgistration;

    const invoiceResult = await createInvoice({
      workspaceURL,
      tenantId,
      registrationId: data.id,
      eventId: $event.id,
    });

    if (invoiceResult?.error) {
      console.error('Invoice error:', invoiceResult.message);
    }

    return {success: true, data: resgistration.data};
  } catch (err) {
    return error(await t((err as any)?.message));
  }
}

export async function paypalCreateOrder({
  values,
  workspaceURL,
  event,
}: {
  values: any;
  workspaceURL: string;
  event: {
    id: string | number;
  };
  email: string;
}) {
  if (!event.id) {
    return error(await t('Event ID is missing'));
  }

  if (!workspaceURL) {
    return error(await t('Workspace not provided!'));
  }

  if (Object.keys(values)?.length === 0) {
    return error(await t('Form values are missing'));
  }

  const validationResult = await validateRequiredFormFields(
    values,
    REQUIRED_FIELDS,
    t,
  );
  if (validationResult) {
    return error(validationResult.error);
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await t('Invalid tenant'));
  }

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return error(await t('Invalid workspace'));
  }

  const hasEventsAccess = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!hasEventsAccess) {
    return error(await t('Unauthorized App access!'));
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return error(await t('Online payment is not available'));
  }

  const paymentOptionSet = workspace?.config?.paymentOptionSet;
  if (!paymentOptionSet?.length) {
    return error(await t('Payment options are not configured.'));
  }

  const allowPaypal = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.paypal,
  );

  if (!allowPaypal) {
    return error(await t('Paypal is not available'));
  }

  const $event = await findEvent({
    id: event.id,
    tenantId,
    workspace,
  });

  if (!$event) {
    return error(await t('Invalid event'));
  }

  const {total: amount} = getCalculatedTotalPrice(values, $event);
  if (!amount || amount <= 0) {
    return error(await t('Total price must be greater than 0.'));
  }

  const currency = $event.currency;

  let emailAddress;
  if (user) {
    const payer = await findPartnerByEmail(user.email, tenantId);
    emailAddress = payer?.emailAddress?.address!;
  } else {
    emailAddress = values.emailAddress;
  }
  const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;
  try {
    const response = await createPaypalOrder({
      amount,
      currency: currencyCode,
      email: emailAddress,
    });
    return {success: true, order: response?.result};
  } catch (err) {
    return {
      error: true,
      message: await t((err as any)?.message),
    };
  }
}
