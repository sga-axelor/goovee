'use client';

import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {formatNumber} from '@/locale/formatters';
import {Separator} from '@/ui/components';
import {DEFAULT_CURRENCY_SCALE, DEFAULT_CURRENCY_SYMBOL} from '@/constants';

const getParticipantsNames = (participants: any[]): string =>
  participants.map((_p: any) => `${_p.name} ${_p.surname}`).join(', ');

export function FacilitiesPriceView({
  form,
  list,
  currency,
  eventPrice,
}: {
  form: any;
  list: any[];
  currency: {
    symbol: string;
    numberOfDecimals: number;
  };
  eventPrice: number;
}) {
  const currencySymbol = currency?.symbol || DEFAULT_CURRENCY_SYMBOL;
  const scale = currency?.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

  const otherPeople = form.watch('otherPeople') || [];
  const rootName = form.watch('name');
  const rootSurname = form.watch('surname');

  const mainParticipant = {
    name: rootName || '',
    surname: rootSurname || '',
    facilities: list,
  };

  const secondaryParticipants = otherPeople.map((p: any) => ({
    ...p,
    facilities: p.facilities || [],
  }));

  const participants = [mainParticipant, ...secondaryParticipants];

  const totalPrice = useMemo(() => {
    const facilitiesTotal = participants?.reduce((total, participant) => {
      return (
        total +
        participant.facilities.reduce(
          (sum: number, facility: any) => sum + facility.price,
          0,
        )
      );
    }, 0);

    return facilitiesTotal + (eventPrice || 0);
  }, [participants, eventPrice]);

  const validParticipants = useMemo(() => {
    return participants.filter(
      (p: any) => p.name.trim() !== '' || p.surname.trim() !== '',
    );
  }, [participants]);

  const hasParticipants = validParticipants?.length > 0;

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
            {list?.map((facility: any) => {
              const facilityUsers = participants?.filter((p: any) =>
                p.facilities.some((f: any) => f.id === facility.id),
              );

              return (
                <div key={facility.id}>
                  <div className="font-semibold text-normal">
                    {facility.facility}:{' '}
                    <span className="font-normal">
                      {formatNumber(facilityUsers?.length)}{' '}
                      {facilityUsers?.length > 0 && (
                        <span className="text-slate-500">
                          ({getParticipantsNames(facilityUsers)})
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
            'Please enter participant details to see facilities and pricing.',
          )}
        </div>
      )}
    </div>
  );
}

export default FacilitiesPriceView;
