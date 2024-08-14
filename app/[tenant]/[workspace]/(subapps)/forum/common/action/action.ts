'use server';
import {getSession} from '@/orm/auth';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/lib/i18n';
import {clone} from '@/utils';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {ID, PortalWorkspace} from '@/types';

//----LOCAL IMPORTS -----//
import {findGroupByMembers, findPosts} from '@/subapps/forum/common/orm/forum';

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

export async function findGroups({
  id = null,
  isMember = true,
  searchKey = '',
  orderBy,
  workspaceID,
}: {
  id: string | null;
  isMember: boolean;
  searchKey?: string;
  orderBy?: any;
  workspaceID: PortalWorkspace['id'];
}) {
  return await findGroupByMembers({
    id,
    isMember,
    searchKey,
    orderBy,
    workspaceID,
  });
}

export async function addPost({
  postDateT,
  group,
  title,
  workspaceURL,
}: {
  postDateT: any;
  title: string;
  group: {id: string};
  workspaceURL: string;
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  const client = await getClient();

  const post = client.aOSPortalForumPost.create({
    data: {
      postDateT,
      createdOn: postDateT,
      forumGroup: {select: {id: group?.id}},
      title,
      author: {select: {id: user?.id}},
    },
  });

  return {success: true, data: post};
}

export async function findMedia(id: ID) {
  const client = await getClient();

  return await client.aOSPortalForumPost
    .find({
      where: {
        ...(id
          ? {
              forumGroup: {
                id,
              },
            }
          : {}),
      },
      select: {
        attachmentList: {
          select: {
            title: true,
            metaFile: {
              fileName: true,
              fileType: true,
            },
          },
        },
      },
    })
    .then(clone);
}

export async function fetchPosts({
  sort,
  limit,
  page,
  search = '',
  workspaceID,
}: {
  sort?: any;
  limit?: number;
  page?: string | number;
  search?: string | undefined;
  workspaceID: PortalWorkspace['id'];
}) {
  return await findPosts({
    sort,
    limit,
    page,
    search,
    workspaceID,
  }).then(clone);
}
