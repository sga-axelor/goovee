import {getSession} from '@/auth';
import {t} from '@/locale/server';
import {findWorkspace} from '@/orm/workspace';
import {findPaypalOrder} from '@/payment/paypal/actions';
import {findStripeOrder} from '@/payment/stripe/actions';
import {PaymentOption} from '@/types';
import type {ActionResponse} from '@/types/action';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {formatAmountForStripe} from '@/utils/stripe';
import {error} from './index';
import {DEFAULT_CURRENCY_CODE} from '@/constants';

export async function validatePayment({
  payment,
  workspaceURL,
  tenantId,
}: {
  payment: {
    id: string;
    mode: PaymentOption;
    amount: number;
    currencyCode?: string;
  };
  workspaceURL: string;
  tenantId: string;
}): ActionResponse<true> {
  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});
  if (!workspace) return error(await t('Invalid workspace'));
  const {id, mode, amount: expectedAmount, currencyCode} = payment;
  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return error(await t('Online payment is not available'));
  }

  const paymentOptionSet = workspace?.config?.paymentOptionSet;
  if (!paymentOptionSet?.length) {
    return error(await t('Payment options are not configured'));
  }

  if (!isPaymentOptionAvailable(paymentOptionSet, mode)) {
    if (mode === PaymentOption.paypal) {
      return error(await t('Paypal is not available'));
    }
    if (mode === PaymentOption.stripe) {
      return error(await t('Stripe is not available'));
    }
    return error(await t('Invalid payment mode'));
  }

  let paidAmount = 0;

  try {
    if (mode === PaymentOption.stripe) {
      const stripeSession = await findStripeOrder({id});
      paidAmount = formatAmountForStripe(
        Number(stripeSession?.lines?.data?.[0]?.amount_total || 0),
        currencyCode || DEFAULT_CURRENCY_CODE,
      );
    } else if (mode === PaymentOption.paypal) {
      const response = await findPaypalOrder({id});
      paidAmount = Number(
        response.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount
          ?.value || 0,
      );
    }
  } catch (e) {
    return error(await t('Invalid payment'));
  }
  if (isNaN(paidAmount)) {
    return error(await t('Invalid payment'));
  }
  if (paidAmount < expectedAmount) {
    return error(
      await t(
        `Paid amount ({0}) is less than expected ({1}).`,
        String(paidAmount),
        String(expectedAmount),
      ),
    );
  }
  return {success: true, data: true};
}
