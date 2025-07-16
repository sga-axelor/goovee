import {manager, type Tenant} from '@/lib/core/tenant';
import {xml} from '@/utils/template-string';
import {JSON_MODEL_ATTRS, WidgetAttrsMap} from '../constants';
import type {CustomField, Meta, Model, Template} from '../types/templates';
import {
  getComponentCode,
  isJsonRelationalField,
  isRelationalField,
} from '../utils/templates';

export async function createCustomFields({
  fields,
  model,
  modelField,
  uniqueModel,
  tenantId,
  jsonModel,
}: {
  model: string;
  modelField: string;
  uniqueModel: string;
  fields: CustomField[];
  tenantId: Tenant['id'];
  jsonModel?: {id: string};
}) {
  const client = await manager.getClient(tenantId);
  const timeStamp = new Date();

  const res = await Promise.all(
    fields.map(async (field, i) => {
      const isJsonRelational = isJsonRelationalField(field);
      const isRelational = isRelationalField(field);
      const _field = await client.aOSMetaJsonField.findOne({
        where: {
          name: field.name,
          model,
          modelField,
          ...(jsonModel && {jsonModel: {id: jsonModel.id}}),
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
          name: field.name,
          title: field.title,
          type: field.type,
          sequence: i++,
          uniqueModel,
          widgetAttrs: JSON.stringify({
            ...WidgetAttrsMap[field.type],
            ...field.widgetAttrs,
          }),
          ...(isRelational && {targetModel: field.target}),
          ...(isJsonRelational && {
            targetJsonModel: {select: {name: field.target}},
          }),
          ...(jsonModel && {jsonModel: {select: {id: jsonModel.id}}}),
          visibleInGrid: 'visibleInGrid' in field ? field.visibleInGrid : false,
          nameField: 'nameField' in field ? field.nameField : false,
          contextField: field.contextField,
          contextFieldValue: field.contextFieldValue,
          contextFieldTarget: field.contextFieldTarget,
          contextFieldTargetName: field.contextFieldTargetName,
          contextFieldTitle: field.contextFieldTitle,
          createdOn: timeStamp,
          updatedOn: timeStamp,
        },
        select: {id: true},
      });
      console.log(
        `\x1b[32m✅ Created field:${field.name} | ${jsonModel || model}\x1b[0m`,
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
      const nameField = model.fields.find(f => f.nameField)?.name;
      const _model = await client.aOSMetaJsonModel.findOne({
        where: {name: model.name},
        select: {id: true, name: true},
      });

      if (_model) {
        console.log(`\x1b[33m⚠️ Skipped model: ${model.name}\x1b[0m`);
        return _model;
      }
      const formViewName = `custom-model-${model.name}-form`;
      const gridViewName = `custom-model-${model.name}-grid`;
      const metaModel = await client.aOSMetaJsonModel.create({
        data: {
          name: model.name,
          title: model.title,
          formWidth: 'large',
          nameField: nameField,
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
                    <field name="${JSON_MODEL_ATTRS}" x-json-model="${model.name}" />
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
                  <field name="${JSON_MODEL_ATTRS}" x-json-model="${model.name}" />
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
      return metaModel;
    }),
  );
  return res;
}

export async function creteCMSComponents({
  metas,
  tenantId,
}: {
  metas: Meta[];
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);
  const timeStamp = new Date();
  const components = await Promise.all(
    metas.map(async meta => {
      const code = getComponentCode(meta.code);
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
