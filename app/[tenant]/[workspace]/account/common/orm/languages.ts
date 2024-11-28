import {Tenant, manager} from '@/tenant';
import {clone} from '@/utils';

export async function findLocalizations({tenantId}: {tenantId: Tenant['id']}) {
  if (!tenantId) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const localizations = await client.aOSLocalization
    .find({
      select: {
        name: true,
        code: true,
      },
    })
    .then(clone);

  return localizations;
}
