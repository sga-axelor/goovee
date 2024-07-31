'use client';

import {useRouter} from 'next/navigation';

// ---- LOCAL IMPORTS ---- //
import {
  NavMenu,
  HomePage,
} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/ui/components';
import {MENU} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

const Content = ({
  memberGroups,
  nonMemberGroups,
  userId,
  posts,
}: {
  memberGroups: any;
  nonMemberGroups: any;
  userId: any;
  posts: any;
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
        userId={userId}
        posts={posts}
      />
    </div>
  );
};

export default Content;
