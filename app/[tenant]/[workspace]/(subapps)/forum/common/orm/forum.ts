// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {ID} from '@/types';
import {clone} from '@/utils';

export async function findGroupByMembers({
  id = null,
  isMember,
  searchKey,
  orderBy,
}: {
  id: any;
  isMember: boolean;
  searchKey?: string;
  orderBy?: any;
}) {
  const client = await getClient();

  const whereClause = {
    member: isMember
      ? {
          id,
        }
      : {
          OR: [{id: {ne: id}}, {id: null}],
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
  whereClause = {},
}: {
  sort?: any;
  whereClause?: any;
}) {
  const client = await getClient();

  let orderBy: any = null;

  switch (sort) {
    case 'old':
      orderBy = {createdOn: ORDER_BY.ASC};
      break;
    default:
      orderBy = {createdOn: ORDER_BY.DESC};
  }

  const posts = await client.aOSPortalForumPost.find({
    where: whereClause,
    orderBy,
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

  return posts;
}

export async function findPostsByGroupId(id: ID) {
  const whereClause = {
    forumGroup: {
      id,
    },
  };

  const posts = await findPosts({whereClause});
  return posts;
}

export async function findGroupById(id: ID) {
  const client = await getClient();
  const groups = await client.aOSPortalForum.findOne({
    where: {
      id,
    },
    select: {
      name: true,
      description: true,
      image: {
        fileName: true,
      },
    },
  });
  return groups;
}
