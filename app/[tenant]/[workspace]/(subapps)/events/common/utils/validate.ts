// ---- CORE IMPORTS ---- //
import {DEFAULT_CURRENCY_CODE} from '@/constants';
import {t} from '@/locale/server';
import {findPaypalOrder} from '@/payment/paypal/actions';
import {findStripeOrder} from '@/payment/stripe/actions';
import {PaymentOption, PortalWorkspace} from '@/types';
import type {ActionResponse} from '@/types/action';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {formatAmountForStripe} from '@/utils/stripe';
import {formatAmountForPaybox} from '@/payment/paybox/utils';
import {findPayboxOrder} from '@/payment/paybox/actions';

// ---- LOCAL IMPORTS ---- //
import {error} from './index';

export async function validatePayment({
  payment,
  workspace,
}: {
  payment: {
    data: {
      id?: string;
      params?: any;
    };
    mode: PaymentOption;
    amount: number;
    currencyCode?: string;
  };
  workspace: PortalWorkspace;
}): ActionResponse<true> {
  const {
    data: {id, params},
    mode,
    amount: expectedAmount,
    currencyCode,
  } = payment;

  if (!(id || params)) {
    return error(await t('Payment ID or parameters are required'));
  }

  if (!workspace?.config?.allowOnlinePaymentForEcommerce) {
    return error(await t('Online payment is not available'));
  }

  const paymentOptionSet = workspace?.config?.paymentOptionSet;
  if (!paymentOptionSet?.length) {
    return error(await t('Payment options are not configured'));
  }
  if (!isPaymentOptionAvailable(paymentOptionSet, mode)) {
    const errorMessages: Record<PaymentOption, string> = {
      [PaymentOption.paypal]: 'Paypal is not available',
      [PaymentOption.stripe]: 'Stripe is not available',
      [PaymentOption.paybox]: 'Paybox is not available',
    };
    return error(await t(errorMessages[mode] || 'Invalid payment mode'));
  }

  try {
    const getPaidAmount = async (): Promise<number | ActionResponse<true>> => {
      switch (mode) {
        case PaymentOption.stripe: {
          if (!id) return error(await t('Stripe payment requires an ID'));
          const stripeSession = await findStripeOrder({id});
          return formatAmountForStripe(
            Number(stripeSession?.lines?.data?.[0]?.amount_total || 0),
            currencyCode || DEFAULT_CURRENCY_CODE,
          );
        }
        case PaymentOption.paypal: {
          if (!id) return error(await t('PayPal payment requires an ID'));
          const response = await findPaypalOrder({id});
          return Number(
            response.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount
              ?.value || 0,
          );
        }
        case PaymentOption.paybox: {
          if (!params)
            return error(await t('Paybox payment requires parameters'));
          const payboxOrder = (await findPayboxOrder(params)) as {
            amount: number;
          };
          return Number(formatAmountForPaybox(payboxOrder?.amount));
        }
        default:
          return error(await t('Invalid payment mode'));
      }
    };

    const paidAmount = await getPaidAmount();
    if (typeof paidAmount !== 'number') return paidAmount;

    if (isNaN(paidAmount) || paidAmount < expectedAmount) {
      return error(
        await t(
          `Paid amount ({0}) is less than expected ({1}).`,
          String(paidAmount),
          String(expectedAmount),
        ),
      );
    }

    return {success: true, data: true};
  } catch (e) {
    console.error('Error while validating payment:', e);
    return error(await t('Invalid payment'));
  }
}
