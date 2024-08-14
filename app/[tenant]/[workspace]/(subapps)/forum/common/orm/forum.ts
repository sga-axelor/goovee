// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {ID} from '@/types';
import {clone, getPageInfo, getSkipInfo} from '@/utils';
import {PortalWorkspace} from '@/types';

export async function findGroupByMembers({
  id = null,
  isMember,
  searchKey,
  orderBy,
  workspaceID,
}: {
  id: any;
  isMember: boolean;
  searchKey?: string;
  orderBy?: any;
  workspaceID: PortalWorkspace['id'];
}) {
  if (!workspaceID) return [];
  const client = await getClient();

  const whereClause = {
    member: isMember
      ? {
          id,
        }
      : {
          OR: [{id: {ne: id}}, {id: null}],
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
}: {
  sort?: any;
  limit?: number;
  page?: string | number;
  search?: string | undefined;
  whereClause?: any;
  workspaceID: PortalWorkspace['id'];
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
          metaFile: {
            fileType: true,
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
          // TODO: Make it recursive. level 3
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
  const group = await client.aOSPortalForum.findOne({
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
