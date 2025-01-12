import {findModelRecord, findModelRecords} from '../orm/meta-json-record';
import {JSONManyToMany, JSONManyToOne} from '@/subapps/shop/common/constants';

export async function transformMetaFields(
  metaFields: any[],
  attrs: any,
  tenantId: any,
) {
  const transformedFields = [];

  for (const field of metaFields) {
    let value = null;

    if (attrs) {
      if (field.type === JSONManyToOne && attrs[field.name]) {
        try {
          const modelRecord = await findModelRecord({
            recordId: attrs[field.name].id,
            tenantId: tenantId,
          });

          value = modelRecord?.attrs;
        } catch (error) {
          value = attrs[field.name];
        }
      } else if (field.type === JSONManyToMany && attrs[field.name]) {
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
