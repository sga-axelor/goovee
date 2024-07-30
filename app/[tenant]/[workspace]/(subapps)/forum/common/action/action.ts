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

export async function exitGroup({
  id,
  version,
}: {
  id: string | number;
  version: number;
}) {
  const client = await getClient();

  await client.aOSPortalForumGroupMember.delete({id, version}).then(clone);
}

export async function joinGroup({
  id,
  version,
  userId,
}: {
  id: string;
  version: number;
  userId: string;
}) {
  const client = await getClient();

  await client.aOSPortalForumGroupMember
    .create({
      data: {
        id,
        version,
        forumGroup: {
          select: {
            id,
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
