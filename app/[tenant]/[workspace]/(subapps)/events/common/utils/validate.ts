// ---- CORE IMPORTS ---- //
import type {Tenant} from '@/lib/core/tenant';
import {t} from '@/locale/server';
import {findPayboxOrder} from '@/payment/paybox/actions';
import {findPaypalOrder} from '@/payment/paypal/actions';
import {findStripeOrder} from '@/payment/stripe/actions';
import {PaymentOption} from '@/types';
import type {ActionResponse} from '@/types/action';

// ---- LOCAL IMPORTS ---- //
import {error} from './index';

export const getPaymentInfo = async ({
  mode,
  data,
  tenantId,
}: {
  mode: PaymentOption;
  data: {id?: string; params?: any};
  tenantId: Tenant['id'];
}): Promise<
  ActionResponse<{
    paidAmount: number;
    context: any;
  }>
> => {
  try {
    switch (mode) {
      case PaymentOption.stripe: {
        const {id} = data;
        if (!id) return error(await t('Stripe payment requires an ID'));
        const {amount, context} = await findStripeOrder({
          id,
          tenantId,
        });
        return {success: true, data: {context, paidAmount: amount}};
      }
      case PaymentOption.paypal: {
        const {id} = data;
        if (!id) return error(await t('PayPal payment requires an ID'));
        const {amount, context} = await findPaypalOrder({id, tenantId});

        return {success: true, data: {context: context, paidAmount: amount}};
      }
      case PaymentOption.paybox: {
        const {params} = data;
        if (!params) {
          return error(await t('Paybox payment requires parameters'));
        }
        const {context, amount} = await findPayboxOrder({params, tenantId});
        return {success: true, data: {context, paidAmount: amount}};
      }
      default:
        return error(await t('Invalid payment mode'));
    }
  } catch (e) {
    return error(await t(e instanceof Error ? e.message : 'Invalid payment'));
  }
};
