// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {clone} from '@/utils';

export async function findModelRecords({
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
    .find({
      where: {id: recordId},
    })
    .then(clone);

  return record;
}
