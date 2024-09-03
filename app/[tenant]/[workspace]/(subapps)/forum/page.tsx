// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {DEFAULT_LIMIT} from '@/constants';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import {
  findPosts,
  findUser,
  findGroups,
  findGroupsByMembers,
} from '@/subapps/forum/common/orm/forum';
import Content from './content';
import {GROUPS_ORDER_BY} from '@/subapps/forum/common/constants';
import {ForumGroup} from './common/types/forum';

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

  const {sort, limit, search, comment} = searchParams;

  const groups = await findGroups({workspace}).then(clone);
  const groupIDs = groups.map((group: any) => group.id);

  const memberGroups = userId
    ? await findGroupsByMembers({
        id: userId,
        orderBy: GROUPS_ORDER_BY,
        workspaceID: workspace?.id,
      })
    : [];

  const memberGroupIDs = memberGroups.map(
    (group: any) => group?.forumGroup?.id,
  );

  const nonMemberGroups = groups.filter((group: ForumGroup) => {
    return !memberGroupIDs.includes(group.id);
  });

  const {posts, pageInfo} = await findPosts({
    sort,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    search,
    workspaceID: workspace?.id,
    groupIDs,
    commentSort: comment,
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
