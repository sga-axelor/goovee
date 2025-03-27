export interface SchemaItem {
  type: 'panel' | 'field';
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

export type SchemaType = 'form' | 'grid';

export interface ViewSchema {
  name: string;
  title: string;
  model: string;
  type: SchemaType;
  orderBy?: string;
  items: SchemaItem[];
}
