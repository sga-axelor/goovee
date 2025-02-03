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

export function FacilitiesView({
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

  const handleFacilityToggle = (facility: any) => {
    const currentFacilities = form.getValues(formKey) || [];

    if (isSecondary) {
      const isSelected = currentFacilities.some(
        (f: any) => f.id === facility.id,
      );
      const updatedFacilities = isSelected
        ? currentFacilities.filter((f: any) => f.id !== facility.id)
        : [...currentFacilities, facility];

      form.setValue(formKey, updatedFacilities, {shouldValidate: true});
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {list.map((facility, idx) => {
        const selectedFacilities = form.watch(formKey) || [];
        const isChecked = isSecondary
          ? selectedFacilities.some((f: any) => f.id === facility.id)
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
                    onCheckedChange={() => handleFacilityToggle(facility)}
                    disabled={!isSecondary}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal !mt-0">
                  {facility.facility} ({facility.formattedPrice})
                </FormLabel>
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}

export default FacilitiesView;
