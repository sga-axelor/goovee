'use client';

import {useEffect, useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {
  Checkbox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/ui/components';
import {i18n} from '@/locale';
import {cn} from '@/utils/css';

const getParentFromFormKey = (formKey: string) => {
  const parts = formKey.split('.');
  return parts.slice(0, parts.length - 1).join('.');
};

export function SubscriptionsView({
  formKey,
  form,
  list,
  isSecondary = false,
  event: {price: eventPrice, formattedDefaultPriceAti},
  requiredFacilitiesCustomFields,
}: {
  formKey: string;
  form: any;
  list: any[];
  isSecondary?: boolean;
  event: {
    price: number;
    formattedDefaultPriceAti: string;
  };
  requiredFacilitiesCustomFields: any[];
}) {
  const triggers = useMemo(() => {
    if (!requiredFacilitiesCustomFields?.length) return;
    const fieldNames = requiredFacilitiesCustomFields?.map((f: any) => f.name);

    let parent = getParentFromFormKey(formKey);
    parent = parent && parent + '.';
    return fieldNames?.map((name: string) => parent + name);
  }, [requiredFacilitiesCustomFields, formKey]);

  useEffect(() => {
    const currentValues = form.getValues(formKey);

    if (!Array.isArray(currentValues)) {
      form.setValue(formKey, [], {shouldValidate: true});
    }

    form.setValue(`${formKey}_eventPrice`, true, {shouldValidate: true});
  }, [form, formKey]);

  const selectedSubscriptions = form.watch(formKey) || [];

  const handleSubscriptionToggle = (subscription: any) => {
    const isSelected = selectedSubscriptions.some(
      (f: any) => f.id === subscription.id,
    );

    form.setValue(
      formKey,
      isSelected
        ? selectedSubscriptions.filter((f: any) => f.id !== subscription.id)
        : [...selectedSubscriptions, subscription],
      {shouldValidate: true, shouldDirty: true},
    );
    triggers && form.trigger(triggers);
  };

  const isEventChecked = form.watch(`${formKey}_eventPrice`);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {eventPrice ? (
        <FormField
          control={form.control}
          name={`${formKey}_eventPrice`}
          render={() => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={isEventChecked} disabled={true} />
              </FormControl>
              <FormLabel className="text-sm font-normal !mt-0">
                {i18n.t('Event')} ({isSecondary ? '+' : ''}
                {formattedDefaultPriceAti})
              </FormLabel>
            </FormItem>
          )}
        />
      ) : null}

      {list.map((subscription, idx) => {
        const isChecked = selectedSubscriptions.some(
          (f: any) => f.id === subscription.id,
        );

        return (
          <FormField
            key={`${formKey}.${idx}`}
            control={form.control}
            name={formKey}
            render={() => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={isChecked}
                    className={cn(
                      isChecked ? `!border-success !bg-success` : '',
                    )}
                    onCheckedChange={() =>
                      handleSubscriptionToggle(subscription)
                    }
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal !mt-0">
                  {subscription.facility} ({isSecondary ? '+' : ''}
                  {subscription.formattedPriceAti})
                </FormLabel>
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}

export default SubscriptionsView;
