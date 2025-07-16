import {Tenant} from '@/lib/core/tenant';
import {
  COMPONENT_MODEL,
  CONTENT_MODEL,
  CONTENT_MODEL_ATTRS,
  JSON_MODEL,
  JSON_MODEL_ATTRS,
  CUSTOM_MODEL_PREFIX,
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

function capitalCase(str: string) {
  str = camelCase(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCustomModelName(modelName: string) {
  return CUSTOM_MODEL_PREFIX + capitalCase(modelName);
}

export async function seedTemplates({
  tenantId,
}: {
  tenantId: Tenant['id'];
  templatesDir: string;
}) {
  const models = [];
  for (const meta of metas) {
    if (!meta.name) continue;
    if (meta.models?.length) {
      models.push(...meta.models);
    }
  }

  const components = await creteCMSComponents({
    metas,
    tenantId,
  });

  await createMetaJsonModels({models, tenantId});

  await Promise.all(
    metas.map(async meta => {
      const component = components.find(c => c.code === camelCase(meta.name));

      return createCustomFields({
        prefix: camelCase(meta.name),
        model: CONTENT_MODEL,
        uniqueModel: CONTENT_MODEL,
        modelField: CONTENT_MODEL_ATTRS,
        fields: meta.fields,
        tenantId,
        ...(component && {
          context: {
            contextField: 'component',
            contextFieldTarget: COMPONENT_MODEL,
            contextFieldTargetName: 'title',
            contextFieldTitle: component.title!,
            contextFieldValue: component.id,
          },
        }),
      });
    }),
  );

  await Promise.all(
    models.map(model => {
      if (model.fields?.length) {
        const modelName = getCustomModelName(model.name);
        return createCustomFields({
          model: JSON_MODEL,
          uniqueModel: `${JSON_MODEL} ${modelName}`,
          modelField: JSON_MODEL_ATTRS,
          fields: model.fields,
          jsonModel: modelName,
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
