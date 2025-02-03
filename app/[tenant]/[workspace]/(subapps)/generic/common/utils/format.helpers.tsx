import React from 'react';

import type {Field, Panel} from '@/ui/form';
import {Column} from '@/ui/grid';

const getFieldType = (field: any) => {
  if (field?.relationship != null) {
    return {
      type: field.relationship,
      targetModel: `${field.package}.${field.typeName}`,
    };
  }

  return {type: field?.typeName?.toLowerCase() ?? 'string'};
};

export const formatSchema = (
  schema: any,
  metaFields: any[],
  parent?: string,
): {fields: Field[]; panels: Panel[]} => {
  let fields: Field[] = [];
  let panels: Panel[] = [];

  schema.forEach((_item: any, idx: number) => {
    if (_item.type === 'panel') {
      const _name = _item.name ?? `${parent ?? 'panel'}-${idx}`;
      panels.push({
        parent,
        name: _name,
        title: _item.title,
        colSpan:
          _item.colSpan != null ? parseInt(_item.colSpan, 10) : undefined,
      });

      const {fields: panelsFields, panels: subPanels} = formatSchema(
        _item.items,
        metaFields,
        _name,
      );

      fields.push(...(panelsFields ?? []));
      panels.push(...(subPanels ?? []));
    } else if (_item.type === 'field') {
      const _field = metaFields.find(_f => _f.name === _item.name);
      const {type} = getFieldType(_field);
      fields.push({
        parent,
        name: _item.name,
        type,
        title: !!_item.showTitle ? undefined : _item.autoTitle,
        widget: _item.widget,
        hidden: _item.hidden ?? false,
        required: _item.required ?? false,
        readonly: _item.readonly ?? false,
        colSpan:
          _item.colSpan != null ? parseInt(_item.colSpan, 10) : undefined,
      });
    }
  });

  return {fields, panels};
};

const getContent = (
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

export const formatColumns = (schema: any): {columns: Column[]} => {
  let columns: Column[] = [];

  schema.forEach((_item: any) => {
    if (_item.type === 'field') {
      const name = _item.name;

      columns.push({
        key: name,
        label: !!_item.showTitle ? undefined : _item.autoTitle,
        content: (record: any) => (
          <p className="font-medium">
            {getContent(record, name, _item.targetName)}
          </p>
        ),
        hidden: _item.hidden ?? false,
      });
    }
  });

  return {columns};
};
