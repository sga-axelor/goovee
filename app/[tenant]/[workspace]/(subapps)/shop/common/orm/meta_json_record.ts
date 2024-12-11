// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {clone} from '@/utils';

export async function findModelRecord({
  recordId,
  tenantId,
}: {
  recordId: string;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return [];
  }

  const c = await manager.getClient(tenantId);

  const record = await c.aOSMetaJsonRecord
    .findOne({
      where: {id: recordId},
    })
    .then(clone);

  return record;
}

export async function findModelRecords({
  recordIds,
  tenantId,
}: {
  recordIds: string[];
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return [];
  }

  const c = await manager.getClient(tenantId);

  const record = await c.aOSMetaJsonRecord
    .find({
      where: {
        id: {
          in: recordIds,
        },
      },
    })
    .then(clone);

  return record;
}
