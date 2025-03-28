import type {Field, Panel, Widget} from '../types';

function mapStudioTypes(field: any): any {
  switch (field.type) {
    case 'decimal':
    case 'integer':
      return 'number';
    default:
      return field.type;
  }
}

const removeContextedFields = (fields: any[], object: any): any[] => {
  if (!Array.isArray(fields) || fields.length === 0) {
    return [];
  }

  if (object == null) {
    return fields;
  }

  return fields?.filter((_field: any) => {
    if (_field.contextField == null) {
      return true;
    }

    const objectValue = object?.[_field.contextField]?.id;
    const parsedValue = objectValue ? parseInt(objectValue, 10) : undefined;

    return parsedValue === parseInt(_field.contextFieldValue, 10);
  });
};

function formatField(_i: any): Field {
  let field: Field = {
    name: _i.name,
    title: _i.title,
    type: mapStudioTypes(_i),
    widget: _i.widget?.toLowerCase() as Widget,
    helper: _i.help,
    readonly: _i.readonly,
    required: _i.required,
    order: _i.sequence,
    colSpan: _i?.widgetAttrs?.colSpan,
  };

  if (_i.selection != null) {
    const isMulti = _i.widget?.toLowerCase()?.includes('multi');

    field = {
      ...field,
      type: isMulti ? 'array' : field.type,
      widget: 'select',
      options: {
        itemSet: _i.selectionOptions,
        isMulti,
      },
      subSchema: (isMulti ? field.type : undefined) as any,
    };
  }

  if (_i.maxSize > 0 || _i.minSize > 0) {
    let validationOptions = {};

    if (_i.maxSize > 0) {
      validationOptions = {
        ...validationOptions,
        max: {value: _i.maxSize},
      };
    }

    if (_i.minSize > 0) {
      validationOptions = {
        ...validationOptions,
        min: {value: _i.minSize},
      };
    }

    field = {
      ...field,
      validationOptions,
    };
  }

  return field;
}

export function formatStudioContent(
  metaFields: any[],
  context?: any,
): {fields: Field[]; panels: Panel[]} {
  const fields: Field[] = [];
  const panels: Panel[] = [];
  let lastPanel: string = '';

  removeContextedFields(metaFields, context).forEach(_item => {
    switch (_item.type) {
      case 'panel':
        lastPanel = _item.name;

        panels.push({
          name: _item.name,
          order: _item.sequence,
          title: _item.title,
        });

        break;
      case 'spacer':
      case 'label':
      case 'separator':
      case 'button':
        break;
      default:
        fields.push({...formatField(_item), parent: lastPanel});
        break;
    }
  });

  return {fields, panels};
}

export function formatStudioFields(items: any[], context?: any): Field[] {
  return removeContextedFields(items, context)
    .filter(
      _i =>
        !['panel', 'spacer', 'label', 'separator', 'button'].includes(_i.type),
    )
    .map(formatField);
}

export function extractCustomData(
  formState: any,
  modelField: string,
  customFields: any[],
): any {
  let result: any = {};
  let customData: any = {};

  for (const [key, value] of Object.entries(formState)) {
    if (customFields.find(({name}) => name == key)) {
      customData[key] = value;
    } else {
      result[key] = value;
    }
  }

  return {...result, [modelField]: JSON.stringify(customData)};
}
