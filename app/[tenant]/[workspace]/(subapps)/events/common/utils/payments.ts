// ---- LOCAL IMPORTS ---- //
import {Cloned} from '@/types/util';
import {FullEvent} from '../orm/event';
import type {RegistrationValues, Subscription} from '../actions/validators';

type PriceCalcData = Pick<
  RegistrationValues,
  'subscriptionSet' | 'otherPeople'
>;

export const getCalculatedTotalPrice = (
  data: PriceCalcData,
  event: Pick<FullEvent | Cloned<FullEvent>, 'displayAti' | 'facilityList'>,
): {
  total: number;
  subscriptionPrices: {facility: string; price: number}[];
} => {
  if (!data || !event) return {total: 0, subscriptionPrices: []};

  const facilities = event.facilityList || [];
  const subscriptionPrices: {facility: string; price: number}[] = [];

  const addToSubscriptionPrices = (facility: string, price: number) => {
    const existing = subscriptionPrices.find(s => s.facility === facility);
    if (existing) {
      existing.price += price;
    } else {
      subscriptionPrices.push({facility, price});
    }
  };

  const calculateSubscriptionsTotal = (subs: Subscription[]) => {
    return subs.reduce((sum, sub) => {
      const facility = facilities.find(f => f.id === sub.id);
      const price = facility ? Number(facility.displayAti) || 0 : 0;
      addToSubscriptionPrices(facility?.facility ?? '', price);
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
        calculateSubscriptionsTotal(person.subscriptionSet ?? []) +
        Number(event.displayAti);
    });
  }

  return {total: total || 0, subscriptionPrices};
};
