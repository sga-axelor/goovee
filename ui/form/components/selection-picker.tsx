'use client';

import React, {useMemo} from 'react';
import Select, {SingleValue, MultiValue} from 'react-select';
import {UseFormReturn} from 'react-hook-form';

// ---- CORE IMPORTS ---- //
import type {Field} from '@/ui/form';

function formatValues(formValue: any) {
  if (Array.isArray(formValue)) {
    return formValue;
  } else if (formValue != null) {
    return [formValue];
  } else {
    return [];
  }
}

export const SelectionPicker = ({
  style,
  form,
  field,
  formKey,
  options,
  isMulti = false,
}: {
  style?: any;
  form: UseFormReturn<Record<string, any>, any, undefined>;
  field: Field;
  formKey: string;
  options: any[];
  isMulti?: boolean;
}) => {
  const selectOptions = useMemo(
    () => options?.map(_o => ({..._o, label: _o.title})) ?? [],
    [options],
  );

  const handleChange = (
    selected: MultiValue<any> | SingleValue<any> | null,
  ) => {
    if (Array.isArray(selected)) {
      form.setValue(
        formKey,
        selected.map(({value}) => value),
      );
    } else {
      form.setValue(formKey, selected?.value);
    }
  };

  const formValue = formatValues(form.watch(formKey));

  return (
    <Select
      isMulti={isMulti}
      options={selectOptions}
      placeholder={field.title}
      value={selectOptions.filter(({value}) => formValue.includes(value))}
      onChange={handleChange}
      styles={{
        container: provided => ({...provided, ...style}),
        multiValue: provided => ({
          ...provided,
          backgroundColor: '#CDCFEF',
          borderRadius: '4px',
          padding: '4px 8px',
        }),
        multiValueRemove: provided => ({
          ...provided,
          color: 'black', // Default color
          ':hover': {
            backgroundColor: 'transparent',
            color: 'black', // Hover color for the delete icon
          },
        }),
      }}
    />
  );
};

export default SelectionPicker;
