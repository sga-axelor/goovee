'use client';

import React, {useEffect, useMemo, useState} from 'react';
import Select, {SingleValue, MultiValue} from 'react-select';
import {Field} from './types';

function formatValues(formValue: any) {
  if (Array.isArray(formValue)) {
    return formValue;
  } else if (formValue != null) {
    return [formValue];
  } else {
    return [];
  }
}

const SelectionPicker = ({
  form,
  field,
  formKey,
  options,
  isMulti = false,
}: {
  form: any;
  field: Field;
  formKey: string;
  options: any[];
  isMulti?: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const selectOptions = useMemo(
    () => options?.map(_o => ({..._o, label: _o.title})) ?? [],
    [options],
  );

  const handleChange = (
    selected: MultiValue<OptionType> | SingleValue<OptionType> | null,
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

  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  const formValue = formatValues(form.watch(formKey));

  return isMounted ? (
    <Select
      isMulti={isMulti}
      options={selectOptions}
      placeholder={field.title}
      value={selectOptions.filter(({value}) => formValue.includes(value))}
      onChange={handleChange}
      styles={{
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
  ) : null;
};

export default SelectionPicker;
