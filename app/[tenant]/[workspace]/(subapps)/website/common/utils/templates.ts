import {Tenant} from '@/lib/core/tenant';
import fs from 'fs/promises';
import path from 'path';
import {
  COMPONENT_MODEL,
  CONTENT_MODEL,
  CONTENT_MODEL_ATTRS,
  JSON_MODEL,
  JSON_MODEL_ATTRS,
} from '../constants';
import {
  createCustomFields,
  createMetaJsonModels,
  creteCMSComponents,
} from '../orm/templates';
import {camelCase} from 'lodash-es';

export function capitalCase(str: string) {
  str = camelCase(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getTemplates(templatesDir: string) {
  const templates = (await fs.readdir(templatesDir, {withFileTypes: true}))
    .filter(f => f.isDirectory())
    .map(f => f.name);

  return templates;
}

async function getMetaJSON(templatesDir: string, templateDir: string) {
  const dir = path.join(templatesDir, templateDir);

  try {
    return JSON.parse(
      await fs.readFile(path.join(dir, 'meta.json'), {
        encoding: 'utf-8',
      }),
    );
  } catch (err) {
    return {};
  }
}

export async function seedTemplates({
  tenantId,
  templatesDir,
}: {
  tenantId: Tenant['id'];
  templatesDir: string;
}) {
  const templates = await getTemplates(templatesDir);

  const metas = [];
  const models = [];
  for (const template of templates) {
    const meta = await getMetaJSON(templatesDir, template);
    if (!meta.name) continue;
    metas.push(meta);
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
    metas.map(async (meta: any) => {
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
    models.map((model: any) => {
      if (model.fields?.length) {
        const modelName = capitalCase(model.name);
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
