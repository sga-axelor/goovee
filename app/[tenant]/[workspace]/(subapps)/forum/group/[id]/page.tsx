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
} from '@/subapps/forum/common/orm/forum';
import Content from './content';
import {findGroups} from '@/subapps/forum/common/action/action';

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
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const groupId = params.id as string;
  const {posts, pageInfo} = await findPostsByGroupId(
    groupId,
    workspace?.id,
  ).then(clone);

  const memberGroups = await findGroups({
    id: user?.id as string,
    isMember: true,
    workspaceID: workspace?.id,
  });
  const nonMemberGroups = await findGroups({
    id: user?.id as string,
    isMember: false,
    workspaceID: workspace?.id,
  });

  const selectedGroup = await findGroupById(groupId, workspace?.id).then(clone);

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
    />
  );
}
