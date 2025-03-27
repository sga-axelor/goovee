import type {Field, InputType, Panel, Widget} from '@/ui/form';
import type {Column} from '@/ui/grid';

import {SchemaItem} from './types';
import {findView} from './orm';
import {getModelData} from './actions';

const isArrayField = (relationship: string) => {
  return relationship === 'OneToMany' || relationship === 'ManyToMany';
};

async function getFieldType(
  field: any,
  item: SchemaItem,
): Promise<{[key: string]: any; type: InputType}> {
  if (field?.relationship != null) {
    const modelName = `${field.packageName}.${field.typeName}`;

    if (isArrayField(field.relationship)) {
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

      return {
        type: 'array',
        options: {config},
      };
    }

    const data = await getModelData(modelName);

    return {
      type: 'object',
      options: {
        data,
        targetModel: modelName,
        targetName: 'name',
      },
    };
  }

  return {type: field?.typeName?.toLowerCase() ?? 'string'};
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
