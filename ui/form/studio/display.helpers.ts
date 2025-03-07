// ---- CORE IMPORTS ---- //
import {SelectionPicker} from '@/ui/form';
import type {Field, Widget} from '@/ui/form';

export function mapStudioTypes(field: any): any {
  switch (field.type) {
    case 'decimal':
    case 'integer':
      return 'number';
    default:
      return field.type;
  }
}

export const removeContextedFields = (fields: any[], object: any): any[] => {
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

export function formatStudioFields(items: any[], context?: any): Field[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return removeContextedFields(items, context).map(_i => {
    let field: Field = {
      name: _i.name,
      title: _i.title,
      type: mapStudioTypes(_i),
      widget: _i.widget?.toLowerCase() as Widget,
      helper: _i.help,
      readonly: _i.readonly,
      required: _i.required,
      order: _i.sequence,
    };

    if (_i.selection != null) {
      const isMultiSelect = _i.widget === 'MultiSelect';
      field = {
        ...field,
        type: isMultiSelect ? 'array' : field.type,
        widget: 'custom',
        customComponent: props =>
          SelectionPicker({
            ...props,
            options: _i.selectionOptions,
            isMulti: isMultiSelect,
          }),
        subSchema: isMultiSelect ? field.type : undefined,
      };
    }

    if (_i.maxSize > 0 || _i.minSize > 0) {
      let validationOptions = {};

      if (_i.maxSize > 0) {
        validationOptions = {
          ...validationOptions,
          max: {
            value: _i.maxSize,
          },
        };
      }

      if (_i.minSize > 0) {
        validationOptions = {
          ...validationOptions,
          min: {
            value: _i.minSize,
          },
        };
      }

      field = {
        ...field,
        validationOptions,
      };
    }

    return field;
  });
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
