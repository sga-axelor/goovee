import React from 'react';

import type {Column, SelectionItem} from './types';

export const getContent = (
  record: any,
  field?: string,
  targetName?: string,
  selectionList?: SelectionItem[],
): string => {
  if (record == null) {
    return '-';
  }

  if (field == null) {
    return typeof record === 'string' ? record : '-';
  }

  const value = record[field];

  if (Array.isArray(selectionList) && selectionList.length > 0) {
    return selectionList.find(_i => _i.value === value)?.title ?? value;
  }

  return getContent(value, targetName);
};

export const sortColumns = (items: Partial<Column>[]): Column[] => {
  return items
    .map((_c: Partial<Column>, idx: number) => {
      const getRecordContent = (_record: any) =>
        getContent(_record, _c.key, _c.targetName, _c.selectionList);

      return {
        ..._c,
        getter: getRecordContent,
        content: (record: any) => (
          <p className="font-light">{getRecordContent(record)}</p>
        ),
        hidden: _c.hidden ?? false,
        order: _c.order ?? idx * 10,
      };
    })
    .filter(_c => !_c.hidden)
    .sort((a, b) => a.order - b.order) as Column[];
};

export const selectRecord = (currentSet: any[], record: any): any[] => {
  if (currentSet.find(({id}: any) => id === record.id)) {
    return currentSet.filter(({id}: any) => id !== record.id);
  }

  return [...currentSet, record];
};
