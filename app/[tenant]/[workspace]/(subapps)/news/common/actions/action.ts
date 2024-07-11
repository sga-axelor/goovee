'use server';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {addComment, findNews} from '@/subapps/news/common/orm/news';

export async function createComment({
  id,
  contentComment,
  publicationDateTime,
}: any) {
  return await addComment({id, contentComment, publicationDateTime}).then(
    clone,
  );
}

export async function findSearchNews() {
  const {news} = await findNews({}).then(clone);
  return news;
}
