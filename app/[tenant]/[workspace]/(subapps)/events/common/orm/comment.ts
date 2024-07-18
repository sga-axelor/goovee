// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import type {ID, Comment} from '@/types';

export async function findCommentsForEvent(id: ID) {
  if (!id) return null;

  const c = await getClient();

  const comments = await c.aOSPortalComment.find({
    where: {
      portalEvent: {
        id: {
          eq: id,
        },
      },
    },
    orderBy: {publicationDateTime: ORDER_BY.ASC},
    select: {
      id: true,
      contentComment: true,
      publicationDateTime: true,
      parentComment: {
        id: true,
        contentComment: true,
      },
      childCommentList: {
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
        },
      },
      author: {
        id: true,
        name: true,
      },
      image: {
        id: true,
      },
    },
  });

  return comments;
}

export async function createComment(id: ID, authorId: ID, values: Comment) {
  if (!id) return null;

  const c = await getClient();

  const comment = await c.aOSPortalComment.create({
    data: {
      portalEvent: {
        select: {
          id,
        },
      },

      author: {
        select: {
          id: authorId,
        },
      },
      image:
        values.image != null
          ? {
              create: {
                fileName: values.image?.fileName,
                filePath: values.image?.fileName,
              },
            }
          : {},
      contentComment: values.contentComment,
      publicationDateTime: values.publicationDateTime,
    },
  });

  return comment;
}
