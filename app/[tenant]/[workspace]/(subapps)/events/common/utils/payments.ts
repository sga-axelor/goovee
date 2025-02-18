// ---- LOCAL IMPORTS ---- //
import {findPaypalOrder} from '@/payment/paypal/actions';
import {findStripeOrder} from '@/payment/stripe/actions';
import {EventPayments} from '@/subapps/events/common/types';
import {PaymentOption} from '@/types';

export const getCalculatedTotalPrice = (
  data: Record<string, any>,
  event: EventPayments = {id: '', displayAti: '0', facilityList: []},
): {
  total: number;
  subscriptionPrices: {facility: string; price: number}[];
} => {
  if (!data || !event) return {total: 0, subscriptionPrices: []};

  const facilities = event.facilityList || [];
  const subscriptionPrices: {facility: string; price: number}[] = [];

  const getFacilityPrice = (facilityName: string) => {
    const facility = facilities.find(f => f.facility === facilityName);
    return facility ? parseFloat(facility.displayAti) || 0 : 0;
  };

  const addToSubscriptionPrices = (facility: string, price: number) => {
    const existing = subscriptionPrices.find(s => s.facility === facility);
    if (existing) {
      existing.price += price;
    } else {
      subscriptionPrices.push({facility, price});
    }
  };

  const calculateSubscriptionsTotal = (subscriptions: any[]) => {
    return subscriptions?.reduce((sum, subscription) => {
      const price = getFacilityPrice(subscription.facility);
      addToSubscriptionPrices(subscription.facility, price);
      return sum + price;
    }, 0);
  };
  let total =
    (data.subscriptionSet
      ? calculateSubscriptionsTotal(data.subscriptionSet)
      : 0) + Number(event.displayAti);

  if (Array.isArray(data.otherPeople) && data.otherPeople.length) {
    data.otherPeople.forEach(person => {
      total +=
        calculateSubscriptionsTotal(person.subscriptionSet) +
        Number(event.displayAti);
    });
  }

  return {total: total || 0, subscriptionPrices};
};

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
