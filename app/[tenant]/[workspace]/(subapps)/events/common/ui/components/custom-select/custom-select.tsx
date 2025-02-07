'use client';

import React, {useEffect, useState} from 'react';
import Select, {MultiValue} from 'react-select';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {createDefaultValues} from '@/ui/form';
import type {Field} from '@/ui/form';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useToast} from '@/ui/hooks/use-toast';

// ---- LOCAL IMPORTS ---- //
import {
  fetchContacts,
  isValidParticipant,
} from '@/subapps/events/common/actions/actions';
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
  eventId,
  maxSelections,
}: {
  form: any;
  field: Field;
  renderItem: (item: Field, idx: number) => React.JSX.Element;
  arrayName: string;
  subSchema: Field[];
  eventId: string;
  maxSelections?: number;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();

  const handleChange = async (selected: MultiValue<OptionType>) => {
    const _current = form.getValues(arrayName) ?? [];
    const selectedUsers: any = selected ?? [];
    const customParticipants = _current.filter(
      ({fromParticipant, valueId}: any) =>
        !fromParticipant ||
        (fromParticipant &&
          selectedUsers.find((_s: any) => _s.id === valueId) != null),
    );

    const invalidParticipants: string[] = [];
    for await (const _s of selectedUsers) {
      if (
        customParticipants.find(
          ({valueId, fromParticipant}: any) =>
            fromParticipant && valueId === _s.id,
        ) == null
      ) {
        if (maxSelections && maxSelections <= customParticipants.length + 1) {
          toast({
            variant: 'destructive',
            title: i18n.t(
              'Registrations are limited to {0} participants only.',
              String(maxSelections),
            ),
          });
          return;
        }
        const {error, message} = await isValidParticipant({
          email: _s.emailAddress?.address,
          eventId,
          workspaceURL,
        });
        if (error) {
          toast({variant: 'destructive', title: message});
          invalidParticipants.push(_s.id);
        } else {
          customParticipants.unshift({
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
      }
    }

    form.setValue(arrayName, customParticipants);
    form.setValue(
      field.name,
      selected.filter(({value}) => !invalidParticipants.includes(value)),
    );
  };

  const handleInputChange = async (input: string = '') => {
    setInputValue(input.toLocaleLowerCase());

    try {
      const data: any = await fetchContacts({search: input, workspaceURL});

      if (data && !data.error) {
        setFilteredOptions(formatItems(data));
      } else {
        toast({
          variant: 'destructive',
          title: i18n.t(data?.message || 'Error while fetching contacts.'),
        });
      }
    } catch (error) {
      console.error('Error fetching options:', error);
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

  useEffect(() => {
    handleInputChange();
  }, []);

  return (
    <Select
      isMulti
      options={filteredOptions}
      placeholder={i18n.t('Select a user')}
      value={form.watch(field.name) ?? []}
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      styles={{
        menuPortal: base => ({...base, zIndex: 9999}),
        menu: provided => ({...provided, zIndex: 9999}),
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
