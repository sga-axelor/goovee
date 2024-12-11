import {log} from 'console';
import {findModelRecord, findModelRecords} from '../orm/meta_json_record';

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
          const modelRecord = await findModelRecord({
            recordId: attrs[field.name].id,
            tenantId: tenantId,
          });

          value = modelRecord?.attrs;
        } catch (error) {
          value = attrs[field.name];
        }
      } else if (field.type === 'json-many-to-many' && attrs[field.name]) {
        const recordIds = attrs[field.name].map((attr: any) => attr.id);
        const modelRecords = await findModelRecords({
          recordIds: recordIds,
          tenantId: tenantId,
        });

        value = modelRecords.map((modelRecord: any) => modelRecord.attrs);
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
