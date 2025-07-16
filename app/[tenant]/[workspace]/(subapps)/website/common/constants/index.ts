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

export const CustomRelationalFieldTypes = [
  FieldType.CustomOneToMany,
  FieldType.CustomManyToMany,
  FieldType.CustomManyToOne,
];

export enum ComponentType {
  block = 0,
  topMenu = 1,
  leftRightMenu = 2,
}
