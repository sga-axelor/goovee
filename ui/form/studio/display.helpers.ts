import {Field, Widget} from '../types';
import SelectionPicker from '../selection-picker';

export function mapStudioTypes(field: any): string {
  switch (field.type) {
    case 'decimal':
    case 'integer':
      return 'number';
    default:
      return field.type;
  }
}

export function formatStudioFields(items: any[]): Field[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map(_i => {
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
  let result = {};
  let customData = {};

  for (const [key, value] of Object.entries(formState)) {
    if (customFields.find(({name}) => name == key)) {
      customData[key] = value;
    } else {
      result[key] = value;
    }
  }

  return {...result, [modelField]: JSON.stringify(customData)};
}
