import {findModelRecord, findModelRecords} from '../orm/meta-json-record';
import {
  JSON_MANY_TO_MANY,
  JSON_MANY_TO_ONE,
} from '@/subapps/shop/common/constants';
import type {Client} from '@/goovee/.generated/client';
import type {ModelField} from '@/orm/model-fields';

export async function transformMetaFields(
  metaFields: ModelField[],
  attrs: Record<string, unknown> | null | undefined,
  client: Client,
) {
  const transformedFields = [];

  for (const field of metaFields) {
    let value = null;

    if (attrs) {
      if (field.type === JSON_MANY_TO_ONE && attrs[field.name]) {
        try {
          const manyToOneVal = attrs[field.name] as {id: string};
          const modelRecord = await findModelRecord({
            recordId: manyToOneVal.id,
            client,
          });

          value = modelRecord?.attrs;
        } catch (error) {
          value = attrs[field.name];
        }
      } else if (field.type === JSON_MANY_TO_MANY && attrs[field.name]) {
        const recordIds = (attrs[field.name] as Array<{id: string}>).map(
          attr => attr.id,
        );
        const modelRecords = await findModelRecords({
          recordIds: recordIds,
          client,
        });

        value = modelRecords.map(modelRecord => modelRecord.attrs);
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
