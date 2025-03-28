import type {Field, InputType, Panel, Widget} from '@/ui/form';
import type {Column} from '@/ui/grid';

import {SchemaItem} from './types';
import {findView} from './orm';
import {getModelData} from './actions';

function mapStudioType(field: any): InputType {
  const _type = field?.type?.toLowerCase();
  switch (_type) {
    case 'boolean':
      return 'boolean';
    case 'integer':
    case 'decimal':
    case 'long':
      return 'number';
    case 'many_to_one':
    case 'one_to_one':
      return 'object';
    case 'one_to_many':
    case 'manay_to_many':
      return 'array';
    case 'date':
    case 'datetime':
    case 'string':
    case 'text':
    default:
      return 'string';
  }
}

async function getFieldType(
  field: any,
  item: SchemaItem,
): Promise<{[key: string]: any; type: InputType}> {
  const type = mapStudioType(field);
  const modelName = field?.target;

  if (modelName != null) {
    if (type === 'array') {
      let config: any = {model: modelName};

      if (item.formView != null) {
        const {fields, panels} = await getGenericFormContent(item.formView);
        config = {...config, fields, panels};
      }

      if (item.gridView != null) {
        const {columns} = await getGenericGridContent(item.gridView);
        config = {...config, columns};

        if (item.canSelect === 'true') {
          const data = await getModelData(modelName);
          config = {...config, data};
        }
      }

      return {type, options: {config}};
    }

    const data = await getModelData(modelName);

    return {
      type,
      options: {
        data,
        targetModel: modelName,
        targetName: field?.targetName ?? 'name',
      },
    };
  }

  return {type};
}

export async function getGenericFormContent(viewName: string) {
  const {schema, metaFields} = await findView({
    name: viewName,
    schemaType: 'form',
  });

  return {
    ...(await formatSchema(schema?.items ?? [], metaFields ?? [])),
    model: schema?.model,
  };
}

export async function formatSchema(
  schema: SchemaItem[],
  metaFields: any[],
  parent?: string,
): Promise<{fields: Field[]; panels: Panel[]}> {
  let fields: Field[] = [];
  let panels: Panel[] = [];

  for (let idx = 0; idx < schema.length; idx++) {
    const _item = schema[idx];

    if (_item.type === 'panel') {
      const _name = _item.name ?? `${parent ?? 'panel'}-${idx}`;
      panels.push({
        parent,
        name: _name,
        title: _item.title,
        colSpan:
          _item.colSpan != null ? parseInt(_item.colSpan, 10) : undefined,
      });

      const {fields: panelsFields, panels: subPanels} = await formatSchema(
        _item.items,
        metaFields,
        _name,
      );

      fields.push(...(panelsFields ?? []));
      panels.push(...(subPanels ?? []));
    } else if (_item.type === 'field') {
      const _field = metaFields.find(_f => _f.name === _item.name);
      const typeConfig = await getFieldType(_field, _item);
      fields.push({
        parent,
        name: _item.name,
        title: !!_item.showTitle ? undefined : _item.autoTitle,
        widget: _item.widget as Widget,
        hidden: _item.hidden ?? false,
        required: _item.required ?? false,
        readonly: _item.readonly ?? false,
        colSpan:
          _item.colSpan != null ? parseInt(_item.colSpan, 10) : undefined,
        ...typeConfig,
      });
    }
  }

  return {fields, panels};
}

export async function getGenericGridContent(viewName: string) {
  const {schema} = await findView({
    name: viewName,
    schemaType: 'grid',
  });

  return {
    ...formatGridSchema(schema?.items ?? [], schema?.sortable),
    model: schema?.model,
  };
}

export function formatGridSchema(
  schema: SchemaItem[],
  sortable = false,
): {
  columns: Partial<Column>[];
} {
  let columns: Partial<Column>[] = [];

  schema.forEach((_item: any) => {
    if (_item.type === 'field') {
      const name = _item.name;

      columns.push({
        key: name,
        label: !!_item.showTitle ? undefined : _item.autoTitle,
        hidden: _item.hidden ?? false,
        targetName: _item.targetName,
        sortable,
      });
    }
  });

  return {columns};
}
