'use client';

import {useEffect, useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {formatNumber} from '@/locale/formatters';
import {Separator} from '@/ui/components';
import {DEFAULT_CURRENCY_SCALE, DEFAULT_CURRENCY_SYMBOL} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {getCalculatedTotalPrice} from '@/subapps/events/common/utils/payments';

const getParticipantsNames = (participants: any[]): string =>
  participants.map((_p: any) => `${_p.name} ${_p.surname}`).join(', ');

export function SubscriptionsPriceView({
  form,
  list,
  currency,
  eventPrice,
  onTotalPriceChange,
}: {
  form: any;
  list: any[];
  currency: {
    symbol: string;
    numberOfDecimals: number;
  };
  eventPrice: number;
  onTotalPriceChange: (value: number) => void;
}) {
  const currencySymbol = currency?.symbol || DEFAULT_CURRENCY_SYMBOL;
  const scale = currency?.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

  const otherPeople = form.watch('otherPeople') || [];
  const rootName = form.watch('name');
  const rootSurname = form.watch('surname');

  const subscriptionSet = useMemo(
    () => form.watch('subscriptionSet') || [],
    [form.watch('subscriptionSet')],
  );

  const selectedMainSubscriptions = useMemo(() => {
    return list.filter(subscription =>
      subscriptionSet.some((s: any) => s.id === subscription.id),
    );
  }, [subscriptionSet, list]);

  const secondaryParticipants = otherPeople.map((p: any) => ({
    ...p,
    subscriptionSet: p.subscriptionSet || [],
  }));

  const participants = useMemo(() => {
    const mainParticipant = {
      name: rootName || '',
      surname: rootSurname || '',
      subscriptionSet: selectedMainSubscriptions,
    };
    return [mainParticipant, ...secondaryParticipants];
  }, [selectedMainSubscriptions, rootName, rootSurname, secondaryParticipants]);

  const totalPrice = useMemo(() => {
    const formValues = {
      name: rootName || '',
      surname: rootSurname || '',
      subscriptionSet: selectedMainSubscriptions,
      otherPeople: secondaryParticipants,
    };

    return getCalculatedTotalPrice(formValues, eventPrice);
  }, [
    selectedMainSubscriptions,
    rootName,
    rootSurname,
    secondaryParticipants,
    eventPrice,
  ]);

  const validParticipants = useMemo(() => {
    return participants.filter(
      (p: any) => p.name.trim() !== '' || p.surname.trim() !== '',
    );
  }, [participants]);

  const hasParticipants = validParticipants?.length > 0;

  useEffect(() => {
    onTotalPriceChange(totalPrice);
  }, [onTotalPriceChange, totalPrice]);

  return (
    <div className="flex flex-col gap-6">
      <Separator className="bg-zinc-300" />

      {hasParticipants ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-xl">
              {i18n.t('Total Price')}:{' '}
              <span className="text-success">
                {formatNumber(totalPrice, {
                  scale,
                  currency: currencySymbol,
                  type: 'DECIMAL',
                })}
              </span>
            </div>
            <div className="font-semibold text-normal">
              {i18n.t('No. of participants')}:{' '}
              <span className="font-normal">
                {validParticipants?.length} (
                {getParticipantsNames(validParticipants)})
              </span>
            </div>
          </div>

          <div className="flex flex-col pl-4 border-success border-l">
            {list?.map((subscription: any) => {
              const subscriptionUsers = participants?.filter((p: any) =>
                p.subscriptionSet.some((f: any) => f.id === subscription.id),
              );

              return (
                <div key={subscription.id}>
                  <div className="font-semibold text-normal">
                    {subscription.facility}:{' '}
                    <span className="font-normal">
                      {formatNumber(subscriptionUsers?.length)}{' '}
                      {subscriptionUsers?.length > 0 && (
                        <span className="text-slate-500">
                          ({getParticipantsNames(subscriptionUsers)})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-sm">
          {i18n.t(
            'Please enter participant details to see subscriptions and pricing.',
          )}
        </div>
      )}
    </div>
  );
}

export default SubscriptionsPriceView;
