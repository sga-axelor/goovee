import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';

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
import {ForumGroup} from '../../common/types/forum';

export default async function Page({
  params,
}: {
  params: {
    id: string;
    tenant: string;
    workspace: string;
  };
}) {
  const session = await getSession();
  const userId = session?.user?.id as string;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const groupId = params.id as string;

  const groups = await findGroups({workspace}).then(clone);

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
  const isMember = memberGroupIDs.includes(groupId);

  const nonMemberGroups = groups.filter((group: ForumGroup) => {
    return !memberGroupIDs.includes(group.id);
  });

  const selectedGroup = await findGroupById(groupId, workspace?.id).then(clone);

  const {posts, pageInfo} = await findPostsByGroupId(
    groupId,
    workspace?.id,
  ).then(clone);

  const user = await findUser({userId}).then(clone);

  if (!selectedGroup) {
    return notFound();
  }

  return (
    <Content
      memberGroups={memberGroups}
      nonMemberGroups={nonMemberGroups}
      user={user}
      posts={posts}
      selectedGroup={selectedGroup}
      pageInfo={pageInfo}
      isMember={isMember}
    />
  );
}
