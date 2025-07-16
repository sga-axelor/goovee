import {manager, type Tenant} from '@/lib/core/tenant';
import {xml} from '@/utils/template-string';
import {
  ComponentType,
  CustomRelationalFieldTypes,
  JSON_MODEL_ATTRS,
  RelationalFieldTypes,
} from '../constants';
import {camelCase} from 'lodash-es';
import {capitalCase} from '../utils/templates';

type Field = {
  type: string;
  name: string;
  title: string;
  target?: string;
};

export async function createCustomFields({
  fields,
  model,
  modelField,
  uniqueModel,
  tenantId,
  prefix,
  jsonModel,
  context,
}: {
  model: string;
  modelField: string;
  uniqueModel: string;
  fields: Field[];
  tenantId: Tenant['id'];
  prefix?: string;
  jsonModel?: string;
  context?: {
    contextField: string;
    contextFieldValue: string;
    contextFieldTarget: string;
    contextFieldTargetName: string;
    contextFieldTitle: string;
  };
}) {
  prefix = prefix || '';
  const client = await manager.getClient(tenantId);
  const timeStamp = new Date();

  const res = await Promise.all(
    fields.map(async (field, i) => {
      const isCustomRelationalField = CustomRelationalFieldTypes.includes(
        field.type,
      );
      const isRelationalField = RelationalFieldTypes.includes(field.type);
      const name = camelCase(`${prefix} ${field.name}`);
      const _field = await client.aOSMetaJsonField.findOne({
        where: {name, model, modelField},
        select: {id: true},
      });
      if (_field) return _field; // TODO: update field

      return await client.aOSMetaJsonField.create({
        data: {
          model,
          modelField,
          name,
          title: field.title,
          type: field.type,
          sequence: i++,
          uniqueModel,
          visibleInGrid: true,
          widgetAttrs: JSON.stringify({
            showTitle: true,
          }),
          ...(isRelationalField && {
            targetModel: field.target,
          }),
          ...(isCustomRelationalField && {
            targetJsonModel: {select: {name: field.target}},
          }),
          ...(jsonModel && {
            jsonModel: {select: {name: jsonModel}},
          }),
          ...context,
          createdOn: timeStamp,
          updatedOn: timeStamp,
        },
        select: {id: true},
      });
    }),
  );

  return res;
}

export async function createMetaJsonModels({
  models,
  tenantId,
}: {
  models: {
    name: string;
    title: string;
    fields: {
      type: string;
      name: string;
      title: string;
      target?: string;
    }[];
  }[];
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);
  const timeStamp = new Date();

  const res = await Promise.all(
    models.map(async model => {
      const name = capitalCase(model.name);
      const _model = await client.aOSMetaJsonModel.findOne({
        where: {name},
        select: {id: true},
      });

      if (_model) return _model;
      return await client.aOSMetaJsonModel.create({
        data: {
          name,
          title: model.title,
          formWidth: 'large',
          formView: {
            create: {
              type: 'form',
              title: model.title,
              model: 'com.axelor.meta.db.MetaJsonRecord',
              xml: xml`<form
                  name="custom-model-${name}-form"
                  title="${model.title}"
                  model="com.axelor.meta.db.MetaJsonRecord"
                  onNew="action-json-record-defaults"
                  width="large">
                  <panel title="Overview" itemSpan="12">
                    <field name="${JSON_MODEL_ATTRS}" x-json-model="${name}" />
                  </panel>
                </form>`,
              createdOn: timeStamp,
              updatedOn: timeStamp,
            },
          },
          gridView: {
            create: {
              type: 'grid',
              title: model.title,
              model: 'com.axelor.meta.db.MetaJsonRecord',
              xml: xml`<grid
                  name="custom-model-${name}-grid"
                  title="${model.title}"
                  model="com.axelor.meta.db.MetaJsonRecord">
                  <field name="${JSON_MODEL_ATTRS}" x-json-model="${name}" />
                </grid>`,
              createdOn: timeStamp,
              updatedOn: timeStamp,
            },
          },
        },
        select: {id: true},
      });
    }),
  );

  return res;
}

export async function creteCMSComponents({
  metas,
  tenantId,
}: {
  metas: {
    name: string;
    title: string;
    type: ComponentType;
  }[];
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);
  const timeStamp = new Date();
  const components = await Promise.all(
    metas.map(async meta => {
      const code = camelCase(meta.name);
      const _component = await client.aOSPortalCmsComponent.findOne({
        where: {code},
        select: {id: true, code: true, title: true},
      });
      if (_component) return _component;

      return client.aOSPortalCmsComponent.create({
        data: {
          code,
          title: meta.title,
          typeSelect: meta.type,
          createdOn: timeStamp,
          updatedOn: timeStamp,
        },
        select: {id: true, code: true, title: true},
      });
    }),
  );
  return components;
}
