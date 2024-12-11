import {log} from 'console';
import {findModelRecords} from '../orm/meta_json_record';

export async function transformMetaFields(
  metaFields: any[],
  attrs: any,
  tenantId: any,
) {
  const transformedFields = [];

  for (const field of metaFields) {
    let value = null;

    if (attrs) {
      if (field.type === 'json-many-to-one' && attrs[field.name]) {
        try {
          const modelRecords = await findModelRecords({
            recordId: attrs[field.name].id,
            tenantId: tenantId,
          });

          value = modelRecords.map(modelRecord => modelRecord.attrs);
        } catch (error) {
          value = attrs[field.name];
        }
      } else {
        value = attrs[field.name];
      }
    }

    transformedFields.push({
      ...field,
      value,
    });
  }

  return transformedFields;
}
