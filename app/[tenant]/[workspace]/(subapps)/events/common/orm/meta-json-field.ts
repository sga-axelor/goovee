// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {clone} from '@/utils';

export async function findModelFields(modelName: string, modelField: string) {
  const c = await getClient();

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

export async function findSelectionItems(selectionName: string) {
  const c = await getClient();

  const options = await c.aOSMetaSelectItem.find({
    where: {
      select: {name: {eq: selectionName}},
    },
  });

  return options;
}
