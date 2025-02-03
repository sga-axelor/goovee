export interface SchemaItem {
  type: 'panel' | 'field';
  name: string;
  title?: string;
  autoTitle?: string;
  showTitle?: boolean;
  colSpan?: string;
  widget?: string;
  target?: string;
  targetName?: string;
  formView?: string;
  gridView?: string;
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
