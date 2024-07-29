// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import {findGroupByMembers} from '@/subapps/forum/common/orm/forum';
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

  return (
    <Content memberGroups={memberGroups} nonMemberGroups={nonMemberGroups} />
  );
}
