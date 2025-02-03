'use client';

import {useEffect} from 'react';

// ---- CORE IMPORTS ---- //
import {
  Checkbox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/ui/components';

export function SubscriptionsView({
  formKey,
  form,
  list,
  isSecondary = false,
}: {
  formKey: string;
  form: any;
  list: any[];
  isSecondary?: boolean;
}) {
  useEffect(() => {
    const currentValues = form.getValues(formKey);

    if (!Array.isArray(currentValues) || currentValues.length === 0) {
      form.setValue(formKey, isSecondary ? [] : list, {shouldValidate: true});
    }
  }, [form, list, formKey, isSecondary]);

  const handleSubscriptionToggle = (subscription: any) => {
    const currentSubscriptions = form.getValues(formKey) || [];

    if (isSecondary) {
      const isSelected = currentSubscriptions.some(
        (f: any) => f.id === subscription.id,
      );
      const updatedSubscriptions = isSelected
        ? currentSubscriptions.filter((f: any) => f.id !== subscription.id)
        : [...currentSubscriptions, subscription];

      form.setValue(formKey, updatedSubscriptions, {shouldValidate: true});
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {list.map((subscription, idx) => {
        const selectedFacilities = form.watch(formKey) || [];
        const isChecked = isSecondary
          ? selectedFacilities.some((f: any) => f.id === subscription.id)
          : true;

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
                    onCheckedChange={() =>
                      handleSubscriptionToggle(subscription)
                    }
                    disabled={!isSecondary}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal !mt-0">
                  {subscription.facility} ({subscription.formattedPrice})
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
