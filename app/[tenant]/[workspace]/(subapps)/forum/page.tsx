// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import {findPosts, findUser} from '@/subapps/forum/common/orm/forum';
import Content from './content';
import {findGroups} from '@/subapps/forum/common/action/action';

export default async function Page() {
  const session = await getSession();

  const userId = session?.user?.id as string;

  const memberGroups = await findGroups({
    id: userId,
    isMember: true,
  });

  const nonMemberGroups = await findGroups({
    id: userId,
    isMember: false,
  });

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
