'use server';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {clone} from '@/utils';

export async function addPinnedGroup({
  id,
  isPin,
  group,
}: {
  id: string | number;
  isPin: boolean;
  group: any;
}) {
  const client = await getClient();

  await client.aOSPortalForumGroupMember
    .update({
      data: {
        forumGroup: {
          select: {
            id,
          },
        },
        ...group,
        isPin,
      },
    })
    .then(clone);
}
