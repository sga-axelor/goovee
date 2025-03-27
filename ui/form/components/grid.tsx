'use client';

import React, {useCallback} from 'react';
import {UseFormReturn} from 'react-hook-form';

import type {Field as FieldType, Panel} from '@/ui/form';
import {Column, GridView} from '@/ui/grid';

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

  return (
    <GridView
      title={item.title}
      style={{margin: 0, padding: 0}}
      columns={columns ?? []}
      data={form.getValues(identifier) ?? []}
      handleRowClick={console.log}
      creationContent={fields ? {fields, panels, model} : undefined}
      selectionContent={data ? {data, handleSelect} : undefined}
      canCreate={!readonly}
      canSelect={!readonly}
    />
  );
};

export default FormGridComponent;
