// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {ID} from '@/types';
import {clone, getPageInfo, getSkipInfo} from '@/utils';
import {PortalWorkspace} from '@/types';

export async function findGroups({
  workspace,
}: {
  workspace: PortalWorkspace;
  memberGroupIDs?: any;
}) {
  if (!workspace) return [];

  const client = await getClient();

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
}: {
  id: any;
  searchKey?: string;
  orderBy?: any;
  workspaceID: PortalWorkspace['id'];
}) {
  if (!workspaceID) return [];
  const client = await getClient();
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

export async function findUser({userId}: {userId: any}) {
  if (!userId) {
    return {};
  }
  const client = await getClient();

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
}: {
  sort?: any;
  limit?: number;
  page?: string | number;
  search?: string | undefined;
  whereClause?: any;
  workspaceID: PortalWorkspace['id'];
  groupIDs?: any[];
}) {
  if (!workspaceID) {
    return {
      posts: [],
      pageInfo: {},
    };
  }

  const client = await getClient();

  let orderBy: any = null;

  switch (sort) {
    case 'old':
      orderBy = {createdOn: ORDER_BY.ASC};
      break;
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
      ...(groupIDs ? {id: {in: groupIDs}} : {}),
      ...whereClause.forumGroup,
    },
    ...(search
      ? {
          title: {
            like: `%${search.toLowerCase()}%`,
          },
        }
      : {}),
  };

  const posts = await client.aOSPortalForumPost.find({
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
      content: true,
      attachmentList: {
        select: {
          title: true,
          metaFile: {
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
      commentList: {
        select: {
          id: true,
          contentComment: true,
          publicationDateTime: true,
          author: {
            id: true,
            name: true,
          },
          image: {
            id: true,
          },
          childCommentList: {
            select: {
              childCommentList: true,
              contentComment: true,
              publicationDateTime: true,
              author: {
                id: true,
                name: true,
              },
              image: {
                id: true,
              },
            },
          },
        },
      },
    },
  });
  const pageInfo = getPageInfo({
    count: posts?.[0]?._count,
    page,
    limit,
  });

  return {posts, pageInfo};
}

export async function findPostsByGroupId(id: ID, workspaceID: string) {
  const whereClause = {
    forumGroup: {
      id,
    },
  };

  return await findPosts({whereClause, workspaceID});
}

export async function findGroupById(id: ID, workspaceID: string) {
  if (!workspaceID) {
    return null;
  }
  const client = await getClient();
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

export async function findMemberGroupById(id: ID, workspaceID: string) {
  if (!workspaceID) {
    return null;
  }
  const client = await getClient();
  const group = await client.aOSPortalForumGroupMember.findOne({
    where: {
      id,
      forumGroup: {
        workspace: {
          id: workspaceID,
        },
        id,
      },
    },
    select: {},
  });

  return group;
}
