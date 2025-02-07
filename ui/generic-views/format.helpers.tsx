import type {Field, Panel} from '@/ui/form';
import type {Column} from '@/ui/grid';

import {SchemaItem} from './types';
import {findView} from './orm';

const getFieldType = (field: any) => {
  if (field?.relationship != null) {
    return {
      type: field.relationship,
      targetModel: `${field.package}.${field.typeName}`,
    };
  }

  return {type: field?.typeName?.toLowerCase() ?? 'string'};
};

export async function getGenericFormContent(viewName: string) {
  const {schema, metaFields} = await findView({
    name: viewName,
    schemaType: 'form',
  });

  return {
    ...formatSchema(schema?.items ?? [], metaFields ?? []),
    model: schema?.model,
  };
}

export const formatSchema = (
  schema: SchemaItem[],
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

export async function getGenericGridContent(
  viewName: string,
): Promise<{columns: Partial<Column>[]; model?: string}> {
  const {schema} = await findView({name: viewName, schemaType: 'grid'});

  let columns: Partial<Column>[] = [];

  schema?.items.forEach((_item: any) => {
    if (_item.type === 'field') {
      const name = _item.name;

      columns.push({
        key: name,
        label: !!_item.showTitle ? undefined : _item.autoTitle,
        hidden: _item.hidden ?? false,
        targetName: _item.targetName,
      });
    }
  });

  return {columns, model: schema?.model};
}
