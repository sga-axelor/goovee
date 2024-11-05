import {getClient} from '@/goovee';

export async function getTeamId() {
  const c = await getClient();

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
