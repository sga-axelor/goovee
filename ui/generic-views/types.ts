export enum SchemaItemType {
  panel = 'panel',
  field = 'field',
}

export interface SchemaItem {
  type: SchemaItemType;
  name: string;
  title?: string;
  autoTitle?: string;
  showTitle?: boolean;
  colSpan?: string;
  widget?: string;
  hidden?: boolean;
  readonly?: boolean;
  required?: boolean;
  target?: string;
  targetName?: string;
  formView?: string;
  gridView?: string;
  canSelect?: string;
  items: SchemaItem[];
}

export enum SchemaType {
  form = 'form',
  grid = 'grid',
}
export interface ViewSchema {
  name: string;
  title: string;
  model: string;
  type: SchemaType;
  orderBy?: string;
  sortable?: boolean;
  items: SchemaItem[];
}

export enum MetaFieldType {
  boolean = 'boolean',
  integer = 'integer',
  decimal = 'decimal',
  long = 'long',
  m2o = 'many_to_one',
  o2o = 'one_to_one',
  o2m = 'one_to_many',
  m2m = 'many_to_many',
  date = 'date',
  datetime = 'datetime',
  string = 'string',
  text = 'text',
}
