'use client';

import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  NavMenu,
  HomePage,
} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/ui/components';
import {MENU} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/constants';
import {Group} from '@/subapps/forum/common/types/forum';

const Content = ({
  memberGroups,
  nonMemberGroups,
  user,
  posts,
  pageInfo,
}: {
  memberGroups: Group[];
  nonMemberGroups: Group[];
  user: any;
  posts: any;
  pageInfo: any;
}) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleMenuClick = (link: string) => {
    router.push(`${workspaceURI}/forum/${link}`);
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="hidden lg:block">
        <NavMenu items={MENU} onClick={handleMenuClick} />
      </div>
      <HomePage
        memberGroups={memberGroups}
        nonMemberGroups={nonMemberGroups}
        user={user}
        posts={posts}
        pageInfo={pageInfo}
      />
    </div>
  );
};

export default Content;
