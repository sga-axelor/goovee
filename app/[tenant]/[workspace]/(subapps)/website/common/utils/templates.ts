import {Tenant} from '@/lib/core/tenant';
import {
  COMPONENT_MODEL,
  CONTENT_MODEL,
  CONTENT_MODEL_ATTRS,
  JSON_MODEL,
  JSON_MODEL_ATTRS,
  CUSTOM_MODEL_PREFIX,
  RelationalFieldTypes,
  JsonRelationalFieldTypes,
} from '@/subapps/website/common/constants';
import {
  createCustomFields,
  createMetaJsonModels,
  creteCMSComponents,
  deleteCustomFields,
  deleteMetaJsonModels,
} from '@/subapps/website/common/orm/templates';
import {camelCase} from 'lodash-es';
import {metas} from '@/subapps/website/common/templates';
import {
  CustomField,
  Field,
  JsonRelationalField,
  Meta,
  Model,
  RelationalField,
} from '../types/templates';

function capitalCase(str: string) {
  str = camelCase(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCustomModelName(modelName: string) {
  return CUSTOM_MODEL_PREFIX + capitalCase(modelName);
}

export function getComponentCode(name: string) {
  return camelCase(name);
}

export function getCustomFieldName(name: string, prefix?: string) {
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

function getFormattedFieldsAndModels(
  metas: Meta[],
  components: {id: string; code?: string; title?: string}[],
): {fields: CustomField[]; models: Model[]} {
  const fields = [];
  const models = [];
  for (const meta of metas) {
    if (!meta.code) continue;
    const code = getComponentCode(meta.code);
    const component = components.find(c => c.code === code);
    if (meta.fields.length) {
      fields.push(
        ...meta.fields.map(field => ({
          ...field,
          name: getCustomFieldName(field.name, code),
          ...(component && {
            contextField: 'component',
            contextFieldTarget: COMPONENT_MODEL,
            contextFieldTargetName: 'title',
            contextFieldTitle: component.title,
            contextFieldValue: component.id,
          }),
        })),
      );
    }
    if (meta.models?.length) {
      models.push(
        ...meta.models.map(model => ({
          ...model,
          name: getCustomModelName(model.name),
          fields: model.fields.map(field => {
            if (isJsonRelationalField(field)) {
              return {
                ...field,
                target: getCustomModelName(field.target),
              };
            }
            return field;
          }),
        })),
      );
    }
  }
  return {fields, models};
}

export async function seedTemplates({
  tenantId,
}: {
  tenantId: Tenant['id'];
  templatesDir: string;
}) {
  if (!validateMeta(metas)) return;

  const components = await creteCMSComponents({
    metas,
    tenantId,
  });

  const {fields, models} = getFormattedFieldsAndModels(metas, components);
  const jsonModels = await createMetaJsonModels({models, tenantId});

  const contentFields = await createCustomFields({
    model: CONTENT_MODEL,
    uniqueModel: CONTENT_MODEL,
    modelField: CONTENT_MODEL_ATTRS,
    fields,
    tenantId,
  });

  await Promise.all(
    models.map(model => {
      if (model.fields?.length) {
        const jsonModel = jsonModels.find(m => m.name === model.name);
        if (!jsonModel) return;
        return createCustomFields({
          model: JSON_MODEL,
          uniqueModel: `${JSON_MODEL} ${model.name}`,
          modelField: JSON_MODEL_ATTRS,
          fields: model.fields,
          jsonModel,
          tenantId,
        });
      }
    }),
  );
}

export async function resetTemplates(tenantId: Tenant['id']) {
  await deleteCustomFields({
    model: CONTENT_MODEL,
    modelField: CONTENT_MODEL_ATTRS,
    tenantId,
  });

  await deleteCustomFields({
    model: JSON_MODEL,
    modelField: JSON_MODEL_ATTRS,
    jsonModelPrefix: CUSTOM_MODEL_PREFIX,
    tenantId,
  });

  await deleteMetaJsonModels({
    jsonModelPrefix: CUSTOM_MODEL_PREFIX,
    tenantId,
  });
}
