// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {clone} from '@/utils';
import type {ID} from '@/types';

export async function findModelFields({
  modelName,
  modelField,
  tenantId,
}: {
  modelName: string;
  modelField: string;
  tenantId: ID;
}) {
  if (!tenantId) {
    return [];
  }

  const c = await getClient(tenantId);

  const fields = await c.aOSMetaJsonField
    .find({
      where: {model: modelName, modelField, type: {ne: 'panel'}},
    })
    .then(clone);

  const result = [];

  for (const _f of fields) {
    if (_f.selection != null) {
      const options = await findSelectionItems(_f.selection);
      result.push({..._f, selectionOptions: options});
    } else {
      result.push(_f);
    }
  }

  return result;
}

export async function findSelectionItems({
  selectionName,
  tenantId,
}: {
  selectionName: string;
  tenantId: ID;
}) {
  if (!tenantId) {
    return [];
  }

  const c = await getClient(tenantId);

  const options = await c.aOSMetaSelectItem.find({
    where: {
      select: {name: {eq: selectionName}},
    },
  });

  return options;
}
