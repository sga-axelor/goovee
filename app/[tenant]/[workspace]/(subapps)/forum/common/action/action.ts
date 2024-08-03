'use server';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {clone} from '@/utils';

export async function addPinnedGroup({
  isPin,
  group,
}: {
  isPin: boolean;
  group: any;
}) {
  const client = await getClient();

  await client.aOSPortalForumGroupMember
    .update({
      data: {
        forumGroup: {
          select: {
            id: group.id,
          },
        },
        ...group,
        isPin,
      },
    })
    .then(clone);
}

export async function exitGroup({group}: {group: any}) {
  const client = await getClient();
  await client.aOSPortalForumGroupMember
    .update({
      data: {
        forumGroup: {
          select: {
            id: group.id,
          },
        },
        member: null,
        ...group,
      },
    })
    .then(clone);
}

export async function joinGroup({group, userId}: {group: any; userId: string}) {
  const client = await getClient();

  await client.aOSPortalForumGroupMember
    .create({
      data: {
        id: group.id,
        version: group.verion,
        forumGroup: {
          select: {
            id: group.id,
          },
        },
        member: {
          select: {id: userId},
        },
      },
    })
    .then(clone);
}

export async function addNotificationsToGroup({
  id,
  version,
  notificationType,
}: {
  id: string;
  version: number;
  notificationType: string;
}) {
  const client = await getClient();

  await client.aOSPortalForumGroupMember
    .create({
      data: {
        id,
        version,
        notificationSelect: notificationType,
      },
    })
    .then(clone);
}
