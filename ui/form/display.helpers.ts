// ---- LOCAL IMPORTS ---- //
import type {Field} from '@/ui/form';
import {DEFAULT_COLSPAN} from '@/ui/form';

export function mapFieldType(field: Field): string {
  if (field.widget != null) {
    switch (field.widget.toLowerCase()) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'url':
        return 'url';
      default:
        break;
    }
  }

  switch (field.type) {
    case 'string':
      return 'text';
    default:
      return field.type;
  }
}

export function getColspan(value: number | undefined) {
  return (Math.min(value ?? 0, DEFAULT_COLSPAN) / DEFAULT_COLSPAN) * 100;
}

export function isField(item: any): boolean {
  return item?.type != null;
}

function getItemDefaultValue(item: Field): any {
  switch (item.type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    default:
      return undefined;
  }
}

export function createDefaultValues(items: Field[]) {
  let result: any = {};

  items.forEach(_i => {
    result[_i.name] = getItemDefaultValue(_i);
  });

  return result;
}
