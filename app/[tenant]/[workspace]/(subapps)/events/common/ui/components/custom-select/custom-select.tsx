'use client';

import React, {useEffect, useState} from 'react';
import Select, {SingleValue, MultiValue} from 'react-select';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {createDefaultValues} from '@/ui/form';
import type {Field} from '@/ui/form';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {searchContacts} from '@/subapps/events/common/actions/actions';
import type {OptionType} from '@/subapps/events/common/ui/components/custom-select/types';

function formatItems(array: any) {
  return (
    array.map((participant: any) => ({
      ...participant,
      value: participant.id,
      label: participant.simpleFullName,
    })) ?? []
  );
}

export const CustomSelect = ({
  form,
  field,
  renderItem,
  arrayName,
  subSchema,
}: {
  form: any;
  field: Field;
  renderItem: (item: Field, idx: number) => React.JSX.Element;
  arrayName: string;
  subSchema: Field[];
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const {workspaceURL} = useWorkspace();

  const handleChange = (
    selected: MultiValue<OptionType> | SingleValue<OptionType> | null,
  ) => {
    const _current = form.getValues(arrayName) ?? [];
    const selectedUsers: any = selected ?? [];
    const customParticipants = _current.filter(
      ({fromParticipant, valueId}: any) =>
        !fromParticipant ||
        (fromParticipant &&
          selectedUsers.find((_s: any) => _s.id === valueId) != null),
    );

    selectedUsers.forEach((_s: any) => {
      if (
        customParticipants.find(
          ({valueId, fromParticipant}: any) =>
            fromParticipant && valueId === _s.id,
        ) == null
      ) {
        customParticipants.push({
          ...createDefaultValues(subSchema),
          ..._s,
          valueId: _s.id,
          fromParticipant: true,
          name: _s.firstName,
          surname: _s.name,
          emailAddress: _s.emailAddress?.address,
          phone: _s.fixedPhone,
          company: _s.mainPartner,
        });
      }
    });

    form.setValue(arrayName, customParticipants);
    form.setValue(field.name, selected);
  };

  const handleInputChange = async (input: string) => {
    setInputValue(input.toLocaleLowerCase());

    if (input.length > 0) {
      try {
        const data: any = await searchContacts(input, workspaceURL);
        setFilteredOptions(formatItems(data));
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    } else {
      setFilteredOptions([]);
    }
  };

  const watchFields = form.watch(arrayName);

  useEffect(() => {
    if (Array.isArray(watchFields)) {
      form.setValue(
        field.name,
        formatItems(watchFields.filter(({fromParticipant}) => fromParticipant)),
      );
    } else {
      form.setValue(field.name, []);
    }
  }, [arrayName, field.name, form, watchFields]);

  return (
    <Select
      isMulti
      options={filteredOptions}
      placeholder={i18n.get('Select a user')}
      value={form.watch(field.name) ?? []}
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      styles={{
        multiValue: provided => ({
          ...provided,
          backgroundColor: '#CDCFEF',
          borderRadius: '0.25rem',
          padding: '0.25rem 0.5rem',
        }),
        multiValueRemove: provided => ({
          ...provided,
          color: 'black',
          ':hover': {
            backgroundColor: 'transparent',
            color: 'black',
          },
        }),
      }}
    />
  );
};

export default CustomSelect;
