// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {clone} from '@/utils';

export async function findModelFields({
  modelName,
  jsonModelName,
  modelField,
  tenantId,
}: {
  modelName?: string;
  jsonModelName?: string;
  modelField: string;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return [];
  }

  const c = await manager.getClient(tenantId);

  const fields = await c.aOSMetaJsonField
    .find({
      where: {
        modelField,
        hidden: false,
        showIf: null,
        ...(modelName && {model: modelName}),
        ...(jsonModelName && {jsonModel: {name: jsonModelName}}),
      },
      orderBy: {sequence: 'ASC'},
      select: {
        columnSequence: true,
        name: true,
        title: true,
        type: true,
        defaultValue: true,
        model: true,
        modelField: true,
        selection: true,
        widget: true,
        help: true,
        hidden: true,
        required: true,
        readonly: true,
        nameField: true,
        minSize: true,
        maxSize: true,
        precision: true,
        scale: true,
        sequence: true,
        regex: true,
        showIf: true,
        contextField: true,
        contextFieldValue: true,
        widgetAttrs: true,
        createdOn: true,
        updatedOn: true,
        targetJsonModel: {name: true},
        jsonModel: {name: true},
        targetModel: true,
      },
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
