import React from 'react';

import type {Column} from './types';

export const getContent = (
  record: any,
  field?: string,
  targetName?: string,
): string => {
  if (record == null) {
    return '-';
  }

  if (field == null) {
    return typeof record === 'string' ? record : '-';
  }

  const value = record[field];

  return getContent(value, targetName);
};

export const sortColumns = (items: Partial<Column>[]): Column[] => {
  return items
    .map((_c: any, idx: number) => ({
      ..._c,
      content: (record: any) => (
        <p className="font-light">
          {getContent(record, _c.key, _c.targetName)}
        </p>
      ),
      hidden: _c.hidden ?? false,
      order: _c.order ?? idx * 10,
    }))
    .filter(_c => !_c.hidden)
    .sort((a, b) => a.order - b.order);
};

export const selectRecord = (currentSet: any[], record: any): any[] => {
  if (currentSet.find(({id}: any) => id === record.id)) {
    return currentSet.filter(({id}: any) => id !== record.id);
  }

  return [...currentSet, record];
};
