// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import {
  findGroupByMembers,
  findPosts,
  findUser,
} from '@/subapps/forum/common/orm/forum';
import Content from './content';

export default async function Page() {
  const session = await getSession();

  const userId = session?.user?.id as string;

  const memberGroups = await findGroupByMembers({
    id: userId,
    isMember: true,
  }).then(clone);

  const nonMemberGroups = await findGroupByMembers({
    id: userId,
    isMember: false,
  }).then(clone);

  const posts = await findPosts().then(clone);

  const user = await findUser({userId}).then(clone);

  return (
    <Content
      memberGroups={memberGroups}
      nonMemberGroups={nonMemberGroups}
      user={user}
      posts={posts}
    />
  );
}
