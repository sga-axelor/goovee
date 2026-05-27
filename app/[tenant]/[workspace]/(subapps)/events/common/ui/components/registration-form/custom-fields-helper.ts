// ---- CORE IMPORTS ---- //
import type {Field} from '@/ui/form';
import {formatStudioFields} from '@/ui/form';

// ---- LOCAL IMPORTS ---- //
import type {FullEvent} from '@/subapps/events/common/orm/event';

type FacilityItem = NonNullable<FullEvent['facilityList']>[number];

type FormStateWithSubscriptions = {
  subscriptionSet?: Array<{id: string}> | null;
  [key: string]: unknown;
};

export const getFacilitiesCustomFields = (
  facilityList: FacilityItem[],
): Field[] => {
  const result: Field[] = [];

  facilityList.forEach((facility: FacilityItem) => {
    const fields = formatStudioFields(facility.additionalFieldSet).map(_f => ({
      ..._f,
      order: 8,
      required: false,
      hideIf: (formState: FormStateWithSubscriptions) => {
        return !formState?.subscriptionSet?.find(
          (_s: {id: string}) => _s.id === facility.id,
        );
      },
      requiredIf: _f.required
        ? (formState: FormStateWithSubscriptions) => {
            return !!formState?.subscriptionSet?.find(
              (_s: {id: string}) => _s.id === facility.id,
            );
          }
        : undefined,
    }));

    result.push(...fields);
  });

  return result;
};

export const getEventCustomFields = (customFields: unknown[]): Field[] => {
  const fields = formatStudioFields(customFields).map(_f => ({
    ..._f,
    order: 6,
  }));

  return fields;
};
