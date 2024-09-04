// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import type {ID, Comment} from '@/types';
import {getSession} from '@/orm/auth';
import {i18n} from '@/lib/i18n';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';

export async function findCommentsByEventID(id: ID, workspaceURL: string) {
  if (!id) return error(i18n.get('Event ID is not present.'));

  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

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

export async function createComment(
  id: ID,
  workspaceURL: string,
  values: Comment,
) {
  if (!id) return null;

  const session = await getSession();

  const result = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (result.error) {
    return result;
  }

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
          id: session?.user.id,
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

  return {success: true, data: comment};
}
