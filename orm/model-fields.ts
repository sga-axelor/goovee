// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {clone} from '@/utils';

export async function findModelFields({
  modelName,
  modelField,
  tenantId,
}: {
  modelName: string;
  modelField: string;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return [];
  }

  const c = await manager.getClient(tenantId);

  const fields = await c.aOSMetaJsonField
    .find({
      where: {model: modelName, modelField, type: {ne: 'panel'}},
    })
    .then(clone);

  const result = [];

  for (const _f of fields) {
    if (_f.selection != null) {
      const options = await findSelectionItems({
        selectionName: _f.selection,
        tenantId,
      });
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
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return [];
  }

  const c = await manager.getClient(tenantId);

  const options = await c.aOSMetaSelectItem.find({
    where: {
      select: {name: {eq: selectionName}},
    },
  });

  return options;
}
