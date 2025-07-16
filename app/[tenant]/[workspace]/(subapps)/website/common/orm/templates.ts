import {manager, type Tenant} from '@/lib/core/tenant';
import {xml} from '@/utils/template-string';
import {
  CustomRelationalFieldTypes,
  JSON_MODEL_ATTRS,
  RelationalFieldTypes,
} from '../constants';
import type {Template, Model} from '../types/templates';
import {camelCase} from 'lodash-es';
import {getCustomModelName} from '../utils/templates';

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
        where: {
          name,
          model,
          modelField,
          ...(jsonModel && {
            jsonModel: {name: jsonModel},
          }),
        },
        select: {id: true},
      });

      if (_field) {
        console.log(
          `\x1b[33m⚠️ Skipped field:${name} | ${jsonModel || model}\x1b[0m `,
        );
        return _field;
      } // TODO: update field

      const metaField = await client.aOSMetaJsonField.create({
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
            targetJsonModel: {
              select: {name: getCustomModelName(field.target!)},
            },
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
      console.log(
        `\x1b[32m✅ Created field:${name} | ${jsonModel || model}\x1b[0m`,
      );
      return metaField;
    }),
  );

  return res;
}

export async function createMetaJsonModels({
  models,
  tenantId,
}: {
  models: Model[];
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);
  const timeStamp = new Date();

  const res = await Promise.all(
    models.map(async model => {
      const name = getCustomModelName(model.name);
      const _model = await client.aOSMetaJsonModel.findOne({
        where: {name},
        select: {id: true},
      });

      if (_model) {
        console.log(`\x1b[33m⚠️ Skipped model: ${name}\x1b[0m`);
        return _model;
      }
      const formViewName = `custom-model-${name}-form`;
      const gridViewName = `custom-model-${name}-grid`;
      const metaModel = await client.aOSMetaJsonModel.create({
        data: {
          name,
          title: model.title,
          formWidth: 'large',
          formView: {
            create: {
              name: formViewName,
              type: 'form',
              title: model.title,
              model: 'com.axelor.meta.db.MetaJsonRecord',
              priority: 20,
              xml: xml`<form
                  name="${formViewName}"
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
              name: gridViewName,
              type: 'grid',
              title: model.title,
              model: 'com.axelor.meta.db.MetaJsonRecord',
              priority: 20,
              xml: xml`<grid
                  name="${gridViewName}"
                  title="${model.title}"
                  model="com.axelor.meta.db.MetaJsonRecord">
                  <field name="${JSON_MODEL_ATTRS}" x-json-model="${name}" />
                </grid>`,
              createdOn: timeStamp,
              updatedOn: timeStamp,
            },
          },
        },
        select: {
          id: true,
          name: true,
          formView: {name: true},
          gridView: {name: true},
        },
      });
      console.log(`\x1b[32m✅ Created model: ${metaModel.name}\x1b[0m `);
      console.log(
        `\x1b[32m✅ Created views: ${metaModel.formView?.name} | ${metaModel.gridView?.name}\x1b[0m `,
      );
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
    type: Template;
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
      if (_component) {
        console.log(
          `\x1b[33m⚠️ Skipped component: ${_component.title}\x1b[0m `,
        );
        return _component;
      }

      const component = await client.aOSPortalCmsComponent.create({
        data: {
          code,
          title: meta.title,
          typeSelect: meta.type,
          createdOn: timeStamp,
          updatedOn: timeStamp,
        },
        select: {id: true, code: true, title: true},
      });

      console.log(`\x1b[32m✅ component: ${component.title}\x1b[0m`);
      return component;
    }),
  );
  return components;
}

export async function deleteCustomFields({
  model,
  modelField,
  tenantId,
  jsonModelPrefix,
}: {
  model: string;
  modelField: string;
  jsonModelPrefix?: string;
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);
  const fields = await client.aOSMetaJsonField.find({
    where: {
      model,
      modelField,
      ...(jsonModelPrefix && {
        jsonModel: {name: {like: jsonModelPrefix + '%'}},
      }),
    },
    select: {id: true, name: true, jsonModel: {name: true}},
  });

  await Promise.all(
    fields.map(field => {
      console.log(
        `\x1b[31m✖ field:${field.name} | ${field.jsonModel?.name || model}.\x1b[0m`,
      );
      client.aOSMetaJsonField.delete({id: field.id, version: field.version});
    }),
  );
}

export async function deleteMetaJsonModels({
  jsonModelPrefix,
  tenantId,
}: {
  jsonModelPrefix?: string;
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);
  const models = await client.aOSMetaJsonModel.find({
    where: {
      name: {like: jsonModelPrefix + '%'},
    },
    select: {
      id: true,
      formView: {id: true, name: true},
      gridView: {id: true, name: true},
      name: true,
    },
  });

  await Promise.all(
    models.map(async model => {
      await client.aOSMetaJsonModel.delete({
        id: model.id,
        version: model.version,
      });
      console.log(`\x1b[31m✖ model:${model.name}.\x1b[0m`);
    }),
  );

  await Promise.all(
    models.map(async model => {
      let formView, gridView;
      if (model.formView) {
        formView = client.aOSMetaView.delete({
          id: model.formView.id,
          version: model.formView.version,
        });
      }
      if (model.gridView) {
        gridView = client.aOSMetaView.delete({
          id: model.gridView.id,
          version: model.gridView.version,
        });
      }
      await formView;
      await gridView;

      console.log(
        `\x1b[31m✖ view:${model.formView?.name} | ${model.gridView?.name}.\x1b[0m`,
      );
    }),
  );
}
