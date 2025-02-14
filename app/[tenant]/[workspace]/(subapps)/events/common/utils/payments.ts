// ---- LOCAL IMPORTS ---- //
import {FormData, Subscription} from '@/subapps/events/common/types';

export const getCalculatedTotalPrice = (
  data: FormData,
  eventPrice = 0,
): number => {
  if (!data) return 0;

  const getSubscriptionTotal = (subscriptions: Subscription[] = []) =>
    subscriptions.reduce((sum, subscription) => {
      const displayAti = parseFloat(subscription.displayAti) || 0;
      return sum + displayAti;
    }, 0);

  let total = getSubscriptionTotal(data.subscriptionSet) + Number(eventPrice);

  if (Array.isArray(data.otherPeople) && data.otherPeople.length) {
    data.otherPeople.forEach(participant => {
      total +=
        getSubscriptionTotal(participant.subscriptionSet) + Number(eventPrice);
    });
  }

  return total || 0;
};
