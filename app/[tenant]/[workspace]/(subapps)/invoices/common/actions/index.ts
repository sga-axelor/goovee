'use server';

import {headers} from 'next/headers';
import axios from 'axios';

// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {getSession} from '@/auth';
import {findSubapp, findSubappAccess, findWorkspace} from '@/orm/workspace';
import {DEFAULT_CURRENCY_CODE, SUBAPP_CODES} from '@/constants';
import {PartnerKey, PaymentOption} from '@/types';
import {findPartnerByEmail} from '@/orm/partner';
import {formatAmountForStripe} from '@/utils/stripe';
import {TENANT_HEADER} from '@/middleware';
import {getWhereClauseForEntity} from '@/utils/filters';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {manager, Tenant} from '@/tenant';
import {ID} from '@goovee/orm';
import {createStripeOrder, findStripeOrder} from '@/payment/stripe/actions';

// ---- LOCAL IMPORTS ---- //
import {findInvoice} from '@/subapps/invoices/common/orm/invoices';
import {extractAmount} from '@/subapps/invoices/common/utils/invoices';
import {
  INVOICE,
  INVOICE_PAYMENT_OPTIONS,
} from '@/subapps/invoices/common/constants/invoices';

export async function createStripeCheckoutSession({
  invoice,
  amount,
  workspaceURL,
}: {
  invoice: any;
  amount: string;
  workspaceURL: string;
}) {
  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Workspace not provided'),
    };
  }

  if (!invoice?.id) {
    return {
      error: true,
      message: await t('Invoice is missing'),
    };
  }

  if (!amount) {
    return {
      error: true,
      message: await t('Amount is missing'),
    };
  }

  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);
  if (!tenantId) {
    return {
      error: true,
      message: await t('Tenant is missing'),
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

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await t('Unauthorized app access'),
    };
  }

  const {role, isContactAdmin} = subapp;
  const invoicesWhereClause = getWhereClauseForEntity({
    user,
    role,
    isContactAdmin,
    partnerKey: PartnerKey.PARTNER,
  });

  const $invoice = await findInvoice({
    id: invoice.id,
    params: {
      where: invoicesWhereClause,
    },
    workspaceURL,
    tenantId,
  });

  if (!$invoice) {
    return {
      error: true,
      message: await t('Invalid invoice'),
    };
  }

  if (workspace?.config?.canPayInvoice === INVOICE_PAYMENT_OPTIONS.NO) {
    return {
      error: true,
      message: await t('Not allowed'),
    };
  }

  const $amount = extractAmount(amount);
  const isPartialPayment =
    workspace?.config?.canPayInvoice === INVOICE_PAYMENT_OPTIONS.PARTIAL;

  const remainingAmount = extractAmount($invoice?.amountRemaining?.value);
  if (
    workspace?.config?.canPayInvoice === INVOICE_PAYMENT_OPTIONS.TOTAL &&
    $amount !== remainingAmount
  ) {
    return {
      error: true,
      message: await t('Payment must match the total amount'),
    };
  } else if (isPartialPayment && $amount > remainingAmount) {
    return {
      error: true,
      message: await t('Payment exceeds the remaining amount.'),
    };
  }

  if (!workspace?.config?.allowOnlinePaymentForInvoices) {
    return {
      error: true,
      message: await t('Online payment is not available'),
    };
  }

  const paymentOptions = workspace?.config?.paymentOptionSet;
  if (!paymentOptions?.length) {
    return {
      error: true,
      message: await t('Payment options are not configured'),
    };
  }

  const allowStripe = isPaymentOptionAvailable(
    paymentOptions,
    PaymentOption.stripe,
  );
  if (!allowStripe) {
    return {
      error: true,
      message: await t('Stripe is not available'),
    };
  }

  const payer = await findPartnerByEmail(user.email, tenantId);
  if (!payer) {
    return {
      error: true,
      message: await t('Unauthorized user'),
    };
  }

  const currencyCode = $invoice?.currency?.code || DEFAULT_CURRENCY_CODE;

  try {
    const session = await createStripeOrder({
      customer: {
        id: payer?.id!,
        email: payer?.emailAddress?.address!,
      },
      name: await t('Invoice Checkout'),
      amount: String($amount) as string,
      currency: currencyCode,
      url: {
        success: `${workspaceURL}/${SUBAPP_CODES.invoices}/${INVOICE.UNPAID}/${$invoice.id}?stripe_session_id={CHECKOUT_SESSION_ID}`,
        error: `${workspaceURL}/${SUBAPP_CODES.invoices}/${INVOICE.UNPAID}/${$invoice.id}?stripe_error=true`,
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
  invoice,
  workspaceURL,
  amount,
}: {
  stripeSessionId: string;
  invoice: {
    id: string | number;
  };
  workspaceURL: string;
  amount: string;
}) {
  if (!stripeSessionId) {
    return {error: true, message: await t('Missing stripe session id!')};
  }

  if (!workspaceURL) {
    return {error: true, message: await t('Workspace not provided!')};
  }

  if (!invoice?.id) {
    return {error: true, message: await t('Invoice is missing')};
  }

  if (!amount) {
    return {
      error: true,
      message: await t('Amount is missing'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);
  if (!tenantId) {
    return {error: true, message: await t('Invalid tenant')};
  }

  try {
    const session = await getSession();
    const user = session?.user;
    if (!user) {
      return {error: true, message: await t('Unauthorized')};
    }

    const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

    if (!workspace) {
      return {error: true, message: await t('Invalid workspace')};
    }

    const subapp = await findSubappAccess({
      code: SUBAPP_CODES.invoices,
      user,
      url: workspace.url,
      tenantId,
    });

    if (!subapp) {
      return {error: true, message: await t('Unauthorized app access')};
    }

    const invoicesWhereClause = getWhereClauseForEntity({
      user,
      role: subapp.role,
      isContactAdmin: subapp.isContactAdmin,
      partnerKey: PartnerKey.PARTNER,
    });

    const $invoice = await findInvoice({
      id: invoice.id,
      params: {where: invoicesWhereClause},
      workspaceURL,
      tenantId,
    });

    if (!$invoice) {
      return {error: true, message: await t('Invalid invoice!')};
    }

    if (!workspace?.config?.allowOnlinePaymentForInvoices) {
      return {
        error: true,
        message: await t('Online payment is not available'),
      };
    }

    if (workspace?.config?.canPayInvoice === INVOICE_PAYMENT_OPTIONS.NO) {
      return {
        error: true,
        message: await t('Invoice payment not allowed'),
      };
    }

    const paymentOptions = workspace?.config?.paymentOptionSet;
    if (!paymentOptions?.length) {
      return {
        error: true,
        message: await t('Payment options not selected!'),
      };
    }

    const allowStripe = isPaymentOptionAvailable(
      paymentOptions,
      PaymentOption.stripe,
    );
    if (!allowStripe) {
      return {
        error: true,
        message: await t('Stripe is not available'),
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

    const currencyCode = $invoice.currency?.code || DEFAULT_CURRENCY_CODE;

    const stripeTotal = stripeSession?.lines?.data?.[0]?.amount_total;

    const remainingAmount = formatAmountForStripe(
      Number($invoice.amountRemaining?.value || 0),
      currencyCode,
    );

    if (
      workspace.config?.canPayInvoice === INVOICE_PAYMENT_OPTIONS.TOTAL &&
      stripeTotal !== remainingAmount
    ) {
      return {
        error: true,
        message: await t('Payment must match the remaining amount'),
      };
    }

    if (
      workspace.config?.canPayInvoice === INVOICE_PAYMENT_OPTIONS.PARTIAL &&
      Number(stripeTotal) > Number(remainingAmount)
    ) {
      return {
        error: true,
        message: await t('Payment exceeds the remaining amount.'),
      };
    }

    const result = await updateInvoice({
      workspaceURL,
      tenantId,
      amount,
      invoiceId: $invoice.id,
    });

    if (result.error) {
      return {
        error: true,
        message:
          result.message ||
          (await t('Something went wrong while updating invoice!')),
      };
    }
    return {success: true, data: $invoice};
  } catch (error) {
    console.error('Error validating Stripe payment:', error);
    return {
      error: true,
      message: await t('An error occurred while processing the payment.'),
    };
  }
}

export async function updateInvoice({
  workspaceURL,
  tenantId,
  amount,
  invoiceId,
}: {
  workspaceURL: string;
  tenantId: Tenant['id'];
  amount: string | number;
  invoiceId: ID;
}) {
  if (!amount || !invoiceId) {
    return {
      error: true,
      message: await t(
        amount ? 'Invoice id is required.' : 'Invoice amount is missing!',
      ),
    };
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({
    url: workspaceURL,
    user,
    tenantId,
  });
  if (!workspace) {
    return {error: true, message: await t('Invalid workspace.')};
  }

  const app = await findSubapp({
    code: SUBAPP_CODES.invoices,
    url: workspace.url,
    user,
    tenantId,
  });

  if (!app?.installed) {
    return {error: true, message: await t('Unauthorized app access.')};
  }

  const {role, isContactAdmin} = app;
  const invoicesWhereClause = getWhereClauseForEntity({
    user,
    role,
    isContactAdmin,
    partnerKey: PartnerKey.PARTNER,
  });

  const invoice = await findInvoice({
    id: invoiceId,
    params: {
      where: invoicesWhereClause,
    },
    workspaceURL,
    tenantId,
  });

  if (!invoice) {
    return {error: true, message: await t('Invalid invoice')};
  }

  const tenant = await manager.getTenant(tenantId);
  if (!tenant) {
    return {
      error: true,
      message: await t('Invalid Tenant'),
    };
  }

  const aos = tenant?.config?.aos;
  if (!aos?.url) {
    return {error: true, message: await t('Webservice not available.')};
  }

  const payload = {
    invoiceId: invoiceId,
    paidAmount: amount,
  };
  try {
    const {data} = await axios.post(
      `${aos.url}/ws/portal/invoice/payment`,
      payload,
      {
        auth: {
          username: aos.auth.username,
          password: aos.auth.password,
        },
      },
    );
    if (data?.status === -1) {
      return {
        error: true,
        message: await t(
          data?.message || 'Unable to update invoice. Please try again later.',
        ),
      };
    }

    return data;
  } catch (err) {
    console.error('Invoice update failed:', err);
    return {
      error: true,
      message: await t(
        'An error occurred while updating your invoice. Please try again later.',
      ),
    };
  }
}
