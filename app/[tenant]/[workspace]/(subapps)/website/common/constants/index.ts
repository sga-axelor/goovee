import {Type} from '../types/templates';

export const NAVIGATION_POSITION = {
  BLOCK: 1,
  TOP_MENU: 2,
  LEFT_RIGHT_MENU: 3,
};
export const CONTENT_MODEL = 'com.axelor.apps.portal.db.PortalCmsContent';
export const COMPONENT_MODEL = 'com.axelor.apps.portal.db.PortalCmsComponent';
export const JSON_MODEL = 'com.axelor.meta.db.MetaJsonRecord';
export const CONTENT_MODEL_ATTRS = 'attrs';
export const JSON_MODEL_ATTRS = 'attrs';

const FieldType = {
  OneToMany: 'one-to-many',
  ManyToMany: 'many-to-many',
  ManyToOne: 'many-to-one',
  CustomOneToMany: 'json-one-to-many',
  CustomManyToMany: 'json-many-to-many',
  CustomManyToOne: 'json-many-to-one',
};

export const RelationalFieldTypes = [
  FieldType.OneToMany,
  FieldType.ManyToMany,
  FieldType.ManyToOne,
];

export const JsonRelationalFieldTypes = [
  FieldType.CustomOneToMany,
  FieldType.CustomManyToMany,
  FieldType.CustomManyToOne,
];

export const ArrayFieldTypes = [
  FieldType.OneToMany,
  FieldType.ManyToMany,
  FieldType.CustomOneToMany,
  FieldType.CustomManyToMany,
];

export const ObjectFieldTypes = [
  FieldType.ManyToOne,
  FieldType.CustomManyToOne,
];

export const WidgetAttrsMap: Record<Type, Record<string, string>> = {
  'one-to-many': {showTitle: 'true'},
  'many-to-many': {showTitle: 'true'},
  'many-to-one': {showTitle: 'true'},
  'json-many-to-many': {showTitle: 'true'},
  'json-many-to-one': {showTitle: 'true'},
  'json-one-to-many': {showTitle: 'true'},
  boolean: {showTitle: 'true'},
  string: {showTitle: 'true'},
  integer: {showTitle: 'true'},
  decimal: {showTitle: 'true'},
  datetime: {showTitle: 'true'},
  date: {showTitle: 'true'},
  time: {showTitle: 'true'},
  panel: {showTitle: 'false'},
};
