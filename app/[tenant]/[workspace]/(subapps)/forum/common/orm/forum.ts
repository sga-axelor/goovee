// ---- CORE IMPORTS ---- //
import {ORDER_BY, SORT_TYPE} from '@/constants';
import {manager, type Tenant} from '@/tenant';
import {ID} from '@/types';
import {clone, getPageInfo, getSkipInfo} from '@/utils';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {getPopularQuery} from '@/subapps/forum/common/utils';
import {Post} from '@/subapps/forum/common/types/forum';

export async function findGroups({
  workspace,
  tenantId,
}: {
  workspace: PortalWorkspace;
  memberGroupIDs?: any;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && tenantId)) return [];

  const client = await manager.getClient(tenantId);

  const groups = await client.aOSPortalForumGroup.find({
    where: {
      workspace: {
        id: workspace.id,
      },
    },
    select: {
      name: true,
      image: {id: true},
    },
  });

  return groups;
}

export async function findGroupsByMembers({
  id = null,
  searchKey,
  orderBy,
  workspaceID,
  tenantId,
}: {
  id: any;
  searchKey?: string;
  orderBy?: any;
  workspaceID: PortalWorkspace['id'];
  tenantId: Tenant['id'];
}) {
  if (!(workspaceID && tenantId)) return [];

  const client = await manager.getClient(tenantId);

  const whereClause = {
    member: {
      AND: [{id: id}, {id: {ne: null}}],
    },
    forumGroup: {
      workspace: {
        id: workspaceID,
      },
    },
    ...(searchKey
      ? {
          forumGroup: {
            name: {
              like: `%${searchKey}%`,
            },
          },
        }
      : {}),
  };

  return await client.aOSPortalForumGroupMember
    .find({
      where: whereClause,
      orderBy,
      select: {
        forumGroup: {
          name: true,
          image: {
            id: true,
          },
        },
        isPin: true,
        notificationSelect: true,
      },
    })
    .then(clone);
}

export async function findUser({
  userId,
  tenantId,
}: {
  userId: any;
  tenantId: Tenant['id'];
}) {
  if (!(userId && tenantId)) {
    return {};
  }

  const client = await manager.getClient(tenantId);

  const user = await client.aOSPartner.findOne({
    where: {
      id: userId,
    },
    select: {
      picture: true,
    },
  });
  return user;
}

export async function findPosts({
  sort = null,
  limit,
  page = 1,
  search = '',
  whereClause = {},
  workspaceID,
  groupIDs = [],
  tenantId,
  ids,
}: {
  sort?: any;
  limit?: number;
  page?: string | number;
  search?: string | undefined;
  ids?: Array<Post['id']> | undefined;
  whereClause?: any;
  workspaceID: PortalWorkspace['id'];
  groupIDs?: any[];
  tenantId: Tenant['id'];
}) {
  if (!(workspaceID && tenantId)) {
    return {
      posts: [],
      pageInfo: {},
    };
  }

  const client = await manager.getClient(tenantId);

  let orderBy: any = null;

  switch (sort) {
    case SORT_TYPE.old:
      orderBy = {createdOn: ORDER_BY.ASC};
      break;
    case SORT_TYPE.popular:
      const query: any = await getPopularQuery({
        page,
        limit,
        workspaceID,
        groupIDs,
        search,
        tenantId,
        ids,
      });
      const {posts = [], pageInfo = {}, error, message} = query;

      return {
        ...(error ? {error: true} : {success: true}),
        message,
        posts,
        pageInfo,
      };

    default:
      orderBy = {createdOn: ORDER_BY.DESC};
  }

  const skip = getSkipInfo(limit, page);

  const combinedWhereClause = {
    ...whereClause,
    forumGroup: {
      workspace: {
        id: workspaceID,
      },
      ...(groupIDs.length ? {id: {in: groupIDs}} : {}),
      ...whereClause.forumGroup,
    },
    ...(search
      ? {
          title: {
            like: `%${search}%`,
          },
        }
      : {}),
    ...(ids?.length ? {id: {in: ids}} : {}),
  };

  const posts = await client.aOSPortalForumPost
    .find({
      where: combinedWhereClause,
      orderBy,
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        title: true,
        forumGroup: {
          name: true,
          image: true,
        },
        postDateT: true,
        content: true,
        attachmentList: {
          select: {
            title: true,
            metaFile: {
              id: true,
              fileType: true,
              fileName: true,
            },
          },
        },
        author: {
          simpleFullName: true,
          picture: true,
        },
        createdOn: true,
      },
    })
    .then(clone)
    .catch(error => console.log('error >>>', error));
  const pageInfo = getPageInfo({
    count: posts?.[0]?._count,
    page,
    limit,
  });

  return {posts, pageInfo};
}

export async function findPostsByGroupId({
  id,
  workspaceID,
  sort = null,
  limit,
  search = '',
  tenantId,
}: {
  id: ID;
  workspaceID: string;
  sort?: any;
  limit?: number;
  search?: string | undefined;
  tenantId: Tenant['id'];
}) {
  const whereClause = {
    forumGroup: {
      id,
    },
  };

  return await findPosts({
    whereClause,
    workspaceID,
    sort,
    limit,
    search,
    groupIDs: [id],
    tenantId,
  });
}

export async function findGroupById(
  id: ID,
  workspaceID: string,
  tenantId: Tenant['id'],
) {
  if (!(workspaceID && tenantId)) {
    return null;
  }

  const client = await manager.getClient(tenantId);

  const group = await client.aOSPortalForumGroup.findOne({
    where: {
      id,
      workspace: {
        id: workspaceID,
      },
    },
    select: {
      name: true,
      description: true,
      image: {
        fileName: true,
      },
    },
  });
  return group;
}

export async function findMemberGroupById({
  id,
  groupID,
  workspaceID,
  tenantId,
}: {
  id: ID;
  groupID: ID;
  workspaceID: string;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceID && tenantId)) {
    return {error: true, message: 'Bad Request'};
  }

  if (!(id || groupID)) {
    return {error: true, message: 'Reccord ID not found'};
  }
  const client = await manager.getClient(tenantId);
  const group = await client.aOSPortalForumGroupMember.findOne({
    where: {
      id,
      forumGroup: {
        workspace: {
          id: workspaceID,
        },
        id: groupID,
      },
    },
    select: {
      forumGroup: true,
    },
  });

  return group;
}
