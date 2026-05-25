// ---- CORE IMPORTS ---- //
import type {Client} from '@/goovee/.generated/client';
import {clone} from '@/utils';

export async function findModelRecord({
  recordId,
  client,
}: {
  recordId: string;
  client: Client;
}) {
  if (!client) {
    return null;
  }

  const record = await client.aOSMetaJsonRecord.findOne({
    where: {id: recordId},
    select: {attrs: true},
  });

  if (!record) return null;

  const attrs = await record.attrs;
  return clone({...record, attrs});
}

export async function findModelRecords({
  recordIds,
  client,
}: {
  recordIds: string[];
  client: Client;
}) {
  if (!client) {
    return [];
  }

  const records = await client.aOSMetaJsonRecord.find({
    where: {
      id: {
        in: recordIds,
      },
    },
    select: {attrs: true},
  });

  const resolved = await Promise.all(
    records.map(async r => {
      const attrs = await r.attrs;
      return {...r, attrs};
    }),
  );

  return clone(resolved);
}
