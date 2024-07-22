export interface Field {
  name: string;
  order?: number;
  title: string;
  helper?: string;
  type: InputType;
  hidden?: boolean;
  hideIf?: (formState: any) => boolean;
  required?: boolean;
  readonly?: boolean;
  widget?: Widget;
  customComponent?: React.ReactNode;
  validationOptions?: {
    [key: string]: {
      value?: any;
      customErrorKey?: string;
    };
  };
  subSchema?: Field[];
}

export type InputType = 'string' | 'number' | 'boolean' | 'array';

export type Widget =
  | 'default'
  | 'email'
  | 'url'
  | 'phone'
  | 'checkbox'
  | 'custom';
