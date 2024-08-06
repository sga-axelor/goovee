'use server';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getCurrentDateTime} from '@/utils/date';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import {addComment, findNews} from '@/subapps/news/common/orm/news';

export async function createComment({id, contentComment, workspaceURL}: any) {
  const publicationDateTime = getCurrentDateTime();

  return await addComment({
    id,
    contentComment,
    publicationDateTime,
    workspaceURL,
  }).then(clone);
}

export async function findSearchNews({workspaceURL}: {workspaceURL: string}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.news,
    user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  const {news} = await findNews({workspace}).then(clone);
  return news;
}
