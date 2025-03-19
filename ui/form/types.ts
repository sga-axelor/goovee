import {UseFormReturn} from 'react-hook-form';

export const DEFAULT_COLSPAN = 12;

interface BasicItem {
  name: string;
  order?: number;
  title?: string;
  parent?: string;
  colSpan?: number;
}

export interface customComponentOptions {
  style?: any;
  field: Field;
  form: UseFormReturn<Record<string, any>, any, undefined>;
  formKey: string;
  readonly?: boolean;
  renderItem?: (item: any, name: string) => React.JSX.Element;
}

export interface Field extends BasicItem {
  helper?: string;
  type: InputType;
  hidden?: boolean;
  hideIf?: (formState: any) => boolean;
  required?: boolean;
  readonly?: boolean;
  widget?: Widget;
  customComponent?: (options: customComponentOptions) => React.JSX.Element;
  validationOptions?: {
    [key: string]: {
      value?: any;
      customErrorKey?: string;
    };
  };
  subSchema?: Field[];
}

export interface Panel extends BasicItem {}

export interface DisplayPanel extends Panel {
  content: (DisplayPanel | Field)[];
}

export type InputType =
  | 'ornament'
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object';

export type Widget =
  | 'default'
  | 'email'
  | 'url'
  | 'phone'
  | 'html'
  | 'checkbox'
  | 'custom';
