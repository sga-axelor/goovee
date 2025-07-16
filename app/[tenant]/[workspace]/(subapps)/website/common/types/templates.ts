import {CamelCase} from '@/types/util';

type OneToMany = 'one-to-many';
type ManyToMany = 'many-to-many';
type ManyToOne = 'many-to-one';
type JsonOneToMany = 'json-one-to-many';
type JsonManyToMany = 'json-many-to-many';
type JsonManyToOne = 'json-many-to-one';
type TBoolean = 'boolean';
type Tstring = 'string';
type Integer = 'integer';
type Decimal = 'decimal';
type Datetime = 'datetime';
type TDate = 'date';
type Time = 'time';

type Type =
  | OneToMany
  | ManyToMany
  | ManyToOne
  | JsonOneToMany
  | JsonManyToMany
  | JsonManyToOne
  | TBoolean
  | Tstring
  | Integer
  | Decimal
  | Datetime
  | TDate
  | Time;

type ToOne = ManyToOne;
type ToMany = OneToMany | ManyToMany;

type JsonToMany = JsonOneToMany | JsonManyToMany;
type JsonToOne = JsonManyToOne;

type RelationalType = OneToMany | ManyToMany | ManyToOne;
type JsonRelationalType = JsonOneToMany | JsonManyToMany | JsonManyToOne;

type PrimitiveType =
  | TBoolean
  | Tstring
  | Integer
  | Decimal
  | Datetime
  | TDate
  | Time;

type PrimitiveMap = {
  string: string;
  integer: number;
  decimal: number;
  datetime: string;
  date: string;
  time: string;
  boolean: boolean;
};

type PrimitiveField = {
  name: string;
  title: string;
  type: PrimitiveType;
};

type RelationalField = {
  name: string;
  title: string;
  type: RelationalType;
  target: string;
};

type JsonRelationalField = {
  name: string;
  title: string;
  type: JsonRelationalType;
  target: string;
};

type Field = PrimitiveField | RelationalField | JsonRelationalField;

export type Model = {
  name: string;
  title: string;
  fields: Field[];
};

export type Meta = {
  title: string;
  name: string;
  type: Template;
  fields: Field[];
  models?: Model[];
};

type FieldType<F, TMeta extends Meta> = F extends {
  type: JsonToMany;
  target: string;
}
  ? {
      id: string;
      attrs: ModelAttrs<F['target'], TMeta>;
    }[]
  : F extends {type: keyof PrimitiveMap}
    ? PrimitiveMap[F['type']]
    : unknown;

type ModelAttrs<
  ModelName extends string,
  TMeta extends Meta,
> = TMeta['models'] extends any[]
  ? Extract<TMeta['models'][number], {name: ModelName}> extends infer M
    ? M extends {fields: Field[]}
      ? {
          [F in M['fields'][number] as F['name']]: FieldType<F, TMeta>;
        }
      : never
    : never
  : never;

type FieldKey<
  F extends {name: string},
  TMeta extends {name: string},
> = `${CamelCase<TMeta['name']>}${Capitalize<CamelCase<F['name']>>}`;

export type Data<TMeta extends Meta> = {
  [F in TMeta['fields'][number] as FieldKey<F, TMeta>]: FieldType<F, TMeta>;
};

export enum Template {
  block = 0,
  topMenu = 1,
  leftRightMenu = 2,
}
