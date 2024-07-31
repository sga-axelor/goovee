// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';

export async function findGroupByMembers({
  id,
  isMember,
}: {
  id: string;
  isMember: boolean;
}) {
  if (!id) {
    return [];
  }
  const client = await getClient();
  const groups = await client.aOSPortalForumGroupMember.find({
    where: {
      member: isMember
        ? {
            id,
          }
        : {
            id: {ne: id},
          },
    },
    orderBy: {
      isPin: ORDER_BY.DESC,
    },
    select: {
      forumGroup: {
        name: true,
      },
      isPin: true,
      notificationSelect: true,
    },
  });
  return groups;
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
