'use client';

import {GridView} from '@/ui/grid';

export const GenericGrid = ({
  columns,
  data = [],
}: {
  columns: any[];
  data?: any[];
}) => {
  return (
    <GridView columns={columns} data={data} handleRowClick={console.log} />
  );
};
