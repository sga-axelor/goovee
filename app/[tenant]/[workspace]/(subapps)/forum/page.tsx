// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {DEFAULT_LIMIT, ORDER_BY} from '@/constants';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import {findPosts, findUser} from '@/subapps/forum/common/orm/forum';
import Content from './content';
import {findGroups} from '@/subapps/forum/common/action/action';

export default async function Page({
  params,
  searchParams,
}: {
  params: any;
  searchParams: {[key: string]: string | undefined};
}) {
  const session = await getSession();
  const userId = session?.user?.id as string;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const {sort, limit, search} = searchParams;

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
    workspaceID: workspace?.id,
  });

  const nonMemberGroups = await findGroups({
    id: userId,
    isMember: false,
    orderBy,
    workspaceID: workspace?.id,
  });

  const {posts, pageInfo} = await findPosts({
    sort,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    search,
    workspaceID: workspace?.id,
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
