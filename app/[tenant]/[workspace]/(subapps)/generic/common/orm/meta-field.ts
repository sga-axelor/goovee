// ---- CORE IMPORTS ---- //
import {type Tenant, manager} from '@/tenant';

export async function findFieldsOfModel({
  name,
  tenantId,
}: {
  name: string;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) return null;

  const c = await manager.getClient(tenantId);

  const result = await c.aOSMetaField.find({
    where: {
      metaModel: {fullName: name},
    },
    select: {
      name: true,
      typeName: true,
      label: true,
      relationship: true,
      packageName: true,
    },
  });

  return result;
}
