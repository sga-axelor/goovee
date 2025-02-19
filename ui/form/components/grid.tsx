'use client';

import React from 'react';
import {UseFormReturn} from 'react-hook-form';

import type {Field as FieldType, Panel} from '@/ui/form';
import {Column, GridView} from '@/ui/grid';

export const FormGridComponent = ({
  form,
  item,
  readonly = false,
  config,
}: {
  form: UseFormReturn<Record<string, any>, any, undefined>;
  item: FieldType;
  readonly?: boolean;
  config?: {
    columns: Partial<Column>[];
    fields: FieldType[];
    panels?: Panel[];
    model: string;
  };
}) => {
  return (
    <GridView
      title={item.title}
      style={{margin: 0, padding: 0}}
      columns={config?.columns ?? []}
      data={form.getValues(item.name) ?? []}
      handleRowClick={console.log}
      creationContent={config}
      canCreate={!readonly}
    />
  );
};

export default FormGridComponent;
