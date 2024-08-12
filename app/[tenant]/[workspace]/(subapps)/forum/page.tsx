// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {DEFAULT_LIMIT, ORDER_BY} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {findPosts, findUser} from '@/subapps/forum/common/orm/forum';
import Content from './content';
import {findGroups} from '@/subapps/forum/common/action/action';

export default async function Page({
  searchParams,
}: {
  searchParams: {[key: string]: string | undefined};
}) {
  const session = await getSession();
  const userId = session?.user?.id as string;

  const {sort, limit} = searchParams;

  const orderBy = {
    isPin: ORDER_BY.DESC,
    forumGroup: {
      name: ORDER_BY.ASC,
    },
  };

  const memberGroups = await findGroups({
    id: userId,
    isMember: true,
    orderBy,
  });

  const nonMemberGroups = await findGroups({
    id: userId,
    isMember: false,
    orderBy,
  });

  const {posts, pageInfo} = await findPosts({
    sort,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
  }).then(clone);

  const user = await findUser({userId}).then(clone);

  return (
    <Content
      memberGroups={memberGroups}
      nonMemberGroups={nonMemberGroups}
      user={user}
      posts={posts}
      pageInfo={pageInfo}
    />
  );
}
