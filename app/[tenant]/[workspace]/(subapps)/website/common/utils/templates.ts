import {Tenant} from '@/lib/core/tenant';
import {
  COMPONENT_MODEL,
  CONTENT_MODEL,
  CONTENT_MODEL_ATTRS,
  JSON_MODEL,
  JSON_MODEL_ATTRS,
  RelationalFieldTypes,
  JsonRelationalFieldTypes,
  ArrayFieldTypes,
  ObjectFieldTypes,
} from '@/subapps/website/common/constants';
import {
  createCMSContent,
  createCustomFields,
  createMetaJsonModel,
  createCMSComponent,
  deleteCustomFields,
  deleteMetaJsonModels,
} from '@/subapps/website/common/orm/templates';
import {camelCase} from 'lodash-es';
import {demos} from '@/subapps/website/common/templates';
import {
  ArrayField,
  CustomField,
  Demo,
  Field,
  JsonRelationalField,
  Meta,
  Model,
  ObjectField,
  RelationalField,
} from '../types/templates';
import {processBatch} from './helper';

const CUSTOM_MODEL_PREFIX = 'GooveeTemplate';

function capitalCase(str: string) {
  str = camelCase(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatCustomModelName(modelName: string) {
  return CUSTOM_MODEL_PREFIX + capitalCase(modelName);
}

export function formatComponentCode(name: string) {
  return camelCase(name);
}

export function formatCustomFieldName(name: string, prefix?: string) {
  prefix = prefix || '';
  return camelCase(`${prefix} ${name}`);
}

export function isRelationalField(field: Field): field is RelationalField {
  return RelationalFieldTypes.includes(field.type);
}

export function isJsonRelationalField(
  field: Field,
): field is JsonRelationalField {
  return JsonRelationalFieldTypes.includes(field.type);
}

export function isArrayField(field: Field): field is ArrayField {
  return ArrayFieldTypes.includes(field.type);
}

export function isObjectField(field: Field): field is ObjectField {
  return ObjectFieldTypes.includes(field.type);
}

function validateMeta(metas: Meta[]) {
  let isValid = true;
  /** conditons
   * 1. model should have at least one field
   * 2. model should have only one nameField
   * 3. model should have at least one visibleInGrid field
   * 4. json target model should have a model declaration within the same meta
   */
  metas.forEach(meta => {
    const jsonModels = new Set();
    meta.fields?.forEach(field => {
      if (isJsonRelationalField(field)) {
        jsonModels.add(field.target);
      }
    });
    meta.models?.forEach(model => {
      let nameFieldCount = 0;
      let visibleInGridCount = 0;
      if (!model.fields.length) {
        isValid = false;
        console.log(
          `\x1b[31m✖ model:${model.name} in ${meta.code} should have at least 1 field.\x1b[0m`,
        );
      }
      for (const field of model.fields) {
        if (isJsonRelationalField(field)) {
          jsonModels.add(field.target);
        }
        if (field.visibleInGrid) visibleInGridCount++;
        if (field.nameField) nameFieldCount++;
        if (nameFieldCount > 1) {
          isValid = false;
        }
      }
      if (nameFieldCount > 1) {
        console.log(
          `\x1b[31m✖ model:${model.name} in ${meta.code} has more than 1 nameField .\x1b[0m`,
        );
      }
      if (visibleInGridCount === 0) {
        isValid = false;
        console.log(
          `\x1b[31m✖ model:${model.name} in ${meta.code} should have at least 1 visibleInGrid field .\x1b[0m`,
        );
      }
      jsonModels.delete(model.name);
    });
    if (jsonModels.size) {
      isValid = false;
      console.log(
        `\x1b[31m✖ model:${[...jsonModels].join(', ')} in ${meta.code} does not have a model declaration .\x1b[0m`,
      );
    }
  });
  return isValid;
}

function getFormattedModels(metas: Meta[]): Model[] {
  const models = [];
  for (const meta of metas) {
    if (meta.models?.length) {
      models.push(
        ...meta.models.map(model => ({
          ...model,
          name: formatCustomModelName(model.name),
          fields: model.fields.map(field => {
            if (isJsonRelationalField(field)) {
              return {
                ...field,
                name: formatCustomFieldName(field.name),
                target: formatCustomModelName(field.target),
              };
            }
            return field;
          }),
        })),
      );
    }
  }
  return models;
}

function getFormattedContentFields(
  metas: Meta[],
  components: {id: string; code?: string; title?: string}[],
): CustomField[] {
  const fields = [];
  for (const meta of metas) {
    const code = formatComponentCode(meta.code);
    const component = components.find(c => c.code === code);
    if (!component) continue;
    if (meta.fields.length) {
      fields.push(
        ...meta.fields.map(field => ({
          ...field,
          name: formatCustomFieldName(field.name, code),
          ...(isJsonRelationalField(field) && {
            target: formatCustomModelName(field.target),
          }),
          contextField: 'component',
          contextFieldTarget: COMPONENT_MODEL,
          contextFieldTargetName: 'title',
          contextFieldTitle: component.title,
          contextFieldValue: component.id,
        })),
      );
    }
  }
  return fields;
}

export async function seedComponents(tenantId: Tenant['id']) {
  const metas = demos.map(demo => demo.meta);
  if (!validateMeta(metas)) return;

  const componentsPromise = metas.map(meta =>
    createCMSComponent({meta, tenantId}),
  );

  const models = getFormattedModels(metas);
  const jsonModels = await Promise.all(
    models.map(async model => createMetaJsonModel({model, tenantId})),
  );

  const customModelPromises = models.map(async model => {
    const jsonModel = jsonModels.find(m => m.name === model.name);
    if (!jsonModel) {
      throw new Error(`Model ${model.name} was not created`);
    }
    const fields = await createCustomFields({
      model: JSON_MODEL,
      uniqueModel: `${JSON_MODEL} ${model.name}`,
      modelField: JSON_MODEL_ATTRS,
      fields: model.fields,
      jsonModel,
      tenantId,
      addPanel: true,
    });
    return {...jsonModel, fields};
  });

  const components = await Promise.all(componentsPromise);

  const fields = getFormattedContentFields(metas, components);
  // NOTE: json models should be created before fields since target models are referenced in fields by name
  const contentFields = await createCustomFields({
    model: CONTENT_MODEL,
    uniqueModel: CONTENT_MODEL,
    modelField: CONTENT_MODEL_ATTRS,
    fields,
    tenantId,
    addPanel: true,
  });

  const customModels = await Promise.all(customModelPromises);

  return {components, contentFields, customModels};
}

export async function resetFields(tenantId: Tenant['id']) {
  await Promise.all([
    deleteCustomFields({
      model: CONTENT_MODEL,
      modelField: CONTENT_MODEL_ATTRS,
      tenantId,
    }),
    deleteCustomFields({
      model: JSON_MODEL,
      modelField: JSON_MODEL_ATTRS,
      jsonModelPrefix: CUSTOM_MODEL_PREFIX,
      tenantId,
    }),
  ]);

  await deleteMetaJsonModels({
    jsonModelPrefix: CUSTOM_MODEL_PREFIX,
    tenantId,
  });
}

export async function seedContents(tenantId: Tenant['id']) {
  const res = await processBatch(demos, async ({meta, demos}) => {
    return await createCMSContent({
      tenantId,
      meta,
      demos: demos as Demo<Meta>[],
    });
  });
  return res;
}
