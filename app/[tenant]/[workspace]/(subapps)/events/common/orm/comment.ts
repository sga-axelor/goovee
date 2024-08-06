// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import type {ID, Comment} from '@/types';
import {getSession} from '@/orm/auth';
import {i18n} from '@/lib/i18n';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

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

//
export async function createComment(
  id: ID,
  workspaceURL: string,
  values: Comment,
) {
  if (!id) return null;

  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
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
