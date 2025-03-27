'use client';

import React, {useCallback, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';

import {type Column, GridView, selectRecord} from '@/ui/grid';

import type {Field as FieldType, Panel} from '../types';

export const FormGridComponent = ({
  form,
  item,
  identifier,
  readonly = false,
  config,
}: {
  form: UseFormReturn<Record<string, any>, any, undefined>;
  item: FieldType;
  identifier: string;
  readonly?: boolean;
  config?: {
    columns: Partial<Column>[];
    fields: FieldType[];
    panels?: Panel[];
    data?: any[];
    model: string;
  };
}) => {
  const {columns, fields, panels, data, model} = config ?? {};

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSelect = useCallback(
    (records: any) => {
      const _current = form.getValues(identifier) ?? [];

      form.setValue(
        identifier,
        [..._current, ...records].filter(
          (_i, idx, self) =>
            self.findIndex(({id}: any) => id === _i.id) === idx,
        ),
      );
    },
    [form, identifier],
  );

  const handleRowSelection = useCallback((record: any) => {
    setSelectedRows(_current => selectRecord(_current, record));
  }, []);

  const handleRemove = useCallback(() => {
    const _current: any[] = form.getValues(identifier) ?? [];

    form.setValue(
      identifier,
      _current.filter(_i => !selectedRows.find(({id}: any) => _i.id === id)),
    );

    setSelectedRows([]);
  }, [form, identifier, selectedRows]);

  return (
    <GridView
      title={item.title}
      style={{margin: 0, padding: 0}}
      columns={columns ?? []}
      data={form.getValues(identifier) ?? []}
      handleRowClick={handleRowSelection}
      creationContent={fields ? {fields, panels, model} : undefined}
      selectionContent={data ? {data, handleSelect} : undefined}
      canCreate={!readonly}
      canSelect={!readonly}
      selectedRows={readonly ? undefined : selectedRows.map(({id}: any) => id)}
      canRemove={!readonly}
      handleRemove={handleRemove}
    />
  );
};
