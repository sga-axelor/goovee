'use client';

import type {Field, Panel} from '@/ui/form';
import {Column, GridView} from '@/ui/grid';

export const GenericGrid = ({
  columns,
  data = [],
  creationContent,
}: {
  columns: Partial<Column>[];
  data?: any[];
  creationContent?: {fields: Field[]; panels: Panel[]; model?: string};
}) => {
  return (
    <GridView
      columns={columns}
      data={data}
      handleRowClick={console.log}
      creationContent={creationContent}
      canCreate
    />
  );
};
