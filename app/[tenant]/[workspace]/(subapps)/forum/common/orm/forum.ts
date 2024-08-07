// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {clone} from '@/utils';

// ---- LOCAL IMPORTAS ----//
import {ID} from '@/subapps/forum/common/types/forum';

export async function findGroupByMembers({
  id = null,
  isMember,
  searchKey,
  sortGroupByName,
}: {
  id: any;
  isMember: boolean;
  searchKey?: string;
  sortGroupByName: string;
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
      orderBy: {
        isPin: ORDER_BY.DESC,
        forumGroup: {
          name: sortGroupByName,
        },
      },
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

export async function findPosts() {
  const client = await getClient();

  const posts = await client.aOSPortalForumPost.find({
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
