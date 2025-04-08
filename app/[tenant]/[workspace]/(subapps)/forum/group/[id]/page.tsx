import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {DEFAULT_LIMIT} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  findGroupById,
  findPostsByGroupId,
  findUser,
  findGroupsByMembers,
  findGroups,
} from '@/subapps/forum/common/orm/forum';
import Content from './content';
import {GROUPS_ORDER_BY} from '@/subapps/forum/common/constants';

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    id: string;
    tenant: string;
    workspace: string;
  };
  searchParams: {[key: string]: string | undefined};
}) {
  const session = await getSession();
  const user = session?.user;
  const userId = user?.id as string;

  const {workspaceURL, tenant} = workspacePathname(params);

  const workspace: any = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const {sort, limit, search} = searchParams;

  const groupId = params.id as string;

  const groups = await findGroups({workspace, tenantId: tenant, user}).then(
    clone,
  );

  const memberGroups: any = userId
    ? await findGroupsByMembers({
        id: userId,
        orderBy: GROUPS_ORDER_BY,
        workspaceID: workspace?.id,
        tenantId: tenant,
        user,
      })
    : [];

  const memberGroupIDs = memberGroups.map(
    (group: any) => group?.forumGroup?.id,
  );

  const nonMemberGroups: any = groups.filter((group: any) => {
    return !memberGroupIDs.includes(group.id);
  });

  const selectedGroup: any = await findGroupById(
    groupId,
    workspace?.id!,
    tenant,
    user,
  ).then(clone);

  const {posts, pageInfo} = await findPostsByGroupId({
    id: groupId,
    workspaceID: workspace?.id,
    sort,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    search,
    tenantId: tenant,
    user,
    memberGroupIDs,
  }).then(clone);

  const $user = await findUser({userId, tenantId: tenant}).then(clone);

  if (!selectedGroup) {
    return notFound();
  }

  return (
    <Content
      memberGroups={memberGroups}
      nonMemberGroups={nonMemberGroups}
      user={$user}
      posts={posts}
      selectedGroup={selectedGroup}
      pageInfo={pageInfo}
      workspace={workspace}
    />
  );
}
