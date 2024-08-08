// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';

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
  };
}) {
  const session = await getSession();
  const user = session?.user;
  const groupId = params.id as string;
  const posts = await findPostsByGroupId(groupId).then(clone);

  const memberGroups = await findGroups({
    id: user?.id as string,
    isMember: true,
  });
  const nonMemberGroups = await findGroups({
    id: user?.id as string,
    isMember: false,
  });

  const selectedGroup = await findGroupById(groupId).then(clone);

  return (
    <Content
      memberGroups={memberGroups}
      nonMemberGroups={nonMemberGroups}
      user={user}
      posts={posts}
      selectedGroup={selectedGroup}
    />
  );
}
