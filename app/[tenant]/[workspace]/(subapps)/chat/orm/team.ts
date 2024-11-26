import {type Tenant, manager} from '@/tenant';

export async function getTeam({tenant}: {tenant: Tenant['id']}) {
  const c = await manager.getClient(tenant);

  if (!c) {
    return null;
  }

  const teamId = c.aOSMattermost.findOne({
    where: {
      id: 1,
    },
    select: {
      teamId: true,
    },
  });

  return teamId;
}
