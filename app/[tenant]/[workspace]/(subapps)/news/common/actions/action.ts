'use server';

// ---- CORE IMPORTS ---- //
import {clone} from '@/subapps/news/common/utils';

// ---- LOCAL IMPORTS ---- //
import {addComment} from '@/subapps/news/common/orm/news';

export async function createComment({
  id,
  contentComment,
  publicationDateTime,
}: any) {
  return await addComment({id, contentComment, publicationDateTime}).then(
    clone,
  );
}
