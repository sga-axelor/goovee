// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';

export async function findGroupByMembers({
  id = null,
  isMember,
}: {
  id: any;
  isMember: boolean;
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
  };

  const groups = await client.aOSPortalForumGroupMember.find({
    where: whereClause,
    orderBy: {
      isPin: ORDER_BY.DESC,
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
  });
  return groups;
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
