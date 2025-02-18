import {findPaypalOrder} from '@/payment/paypal/actions';
import {findStripeOrder} from '@/payment/stripe/actions';
import {PaymentOption} from '@/types';

export const validatePaymentMode = async (
  id: string,
  mode: PaymentOption,
): Promise<{isValid: boolean; paidAmount: number}> => {
  let paidAmount = 0;

  try {
    if (mode === PaymentOption.stripe) {
      const stripeSession = await findStripeOrder({id});

      if (!stripeSession || !stripeSession?.lines?.data?.length) {
        return {isValid: false, paidAmount};
      }

      paidAmount = stripeSession.lines.data[0].amount_total;
    } else if (mode === PaymentOption.paypal) {
      const response = await findPaypalOrder({id});

      if (!response?.result?.purchase_units?.length) {
        return {isValid: false, paidAmount};
      }

      const purchase = response.result.purchase_units[0];
      paidAmount = Number(purchase?.payments?.captures?.[0]?.amount?.value);
    }
  } catch (error) {
    console.error('Error validating payment:', error);
    return {isValid: false, paidAmount};
  }

  return {isValid: true, paidAmount};
};
