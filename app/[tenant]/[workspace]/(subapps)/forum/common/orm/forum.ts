// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';

export async function findGroupByMembers({
  id,
  isMember,
}: {
  id: string;
  isMember: boolean;
}) {
  if (!id) {
    return [];
  }
  const client = await getClient();
  const groups = await client.aOSPortalForumGroupMember.find({
    where: {
      member: isMember
        ? {
            id,
          }
        : {
            id: {ne: id},
          },
    },
    orderBy: {
      isPin: ORDER_BY.DESC,
    },
    select: {
      forumGroup: {
        name: true,
      },
      isPin: true,
    },
  });
  return groups;
}
