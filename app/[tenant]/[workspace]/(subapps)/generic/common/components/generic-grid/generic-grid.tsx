'use client';
import {useMemo} from 'react';

import {GridView} from '@/ui/grid';
import {formatColumns} from '../../utils';

export const GenericGrid = ({
  content,
  data = [],
}: {
  content: any;
  data?: any[];
}) => {
  const {columns} = useMemo(() => formatColumns(content?.items), [content]);

  return (
    <GridView columns={columns} data={data} handleRowClick={console.log} />
  );
};
