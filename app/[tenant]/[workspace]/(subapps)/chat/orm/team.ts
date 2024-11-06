import {type Tenant, manager} from '@/tenant';

export async function getTeamId({tenant}: {tenant: Tenant['id']}) {
  return process.env.MATTERMOST_TEAM_ID;

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
