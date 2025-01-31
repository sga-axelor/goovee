'use client';

import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {formatNumber} from '@/locale/formatters';
import {Separator} from '@/ui/components';

const getParticipantsNames = (participants: any[]): string =>
  participants.map((_p: any) => `${_p.name} ${_p.surname}`).join(', ');

const getFacilityParticipants = (
  participants: any[],
  facilityIdx: number,
): any[] => participants?.filter((_p: any) => _p.facilities?.[facilityIdx]);

export function FacilitiesPriceView({form, list}: {form: any; list: any[]}) {
  const otherPeople = form.watch('otherPeople');
  const rootName = form.watch('name');
  const rootSurname = form.watch('surname');
  const rootFacilities = form.watch('facilities');

  const participants = useMemo(() => {
    let result = otherPeople;

    if (rootName != null) {
      result = [
        {
          name: rootName,
          surname: rootSurname,
          facilities: rootFacilities ?? [],
        },
        ...(result ?? []),
      ];
    }

    return result;
  }, [otherPeople, rootFacilities, rootName, rootSurname]);

  const totalPrice = useMemo(
    () =>
      list.reduce(
        (previous, {price}, idx) =>
          previous + price * getFacilityParticipants(participants, idx).length,
        0,
      ),
    [list, participants],
  );

  return (
    <div className="flex flex-col gap-6">
      <Separator className="bg-zinc-300" />
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-xl">
          {i18n.t('Total Price')}:{' '}
          <span className="text-success">{totalPrice}€</span>
        </div>
        <div className="font-semibold text-normal">
          {i18n.t('No. of participants')}:{' '}
          <span className="font-normal">
            {participants.length} ({getParticipantsNames(participants)})
          </span>
        </div>
      </div>

      <div className="flex flex-col pl-4 border-success border-l">
        {list?.map((_item: any, idx: number) => {
          const list = getFacilityParticipants(participants, idx);

          return (
            <div key={_item.id}>
              <div className="font-semibold text-normal">
                {_item.facility}:{' '}
                <span className="font-normal">
                  {formatNumber(list.length)}{' '}
                  {list.length > 0 && (
                    <span className="text-slate-500">
                      ({getParticipantsNames(list)})
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FacilitiesPriceView;
