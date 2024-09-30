'use client';

import {useRouter} from 'next/navigation';
import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  NavMenu,
  HomePage,
} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/ui/components';
import {MENU} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/constants';
import {Group} from '@/subapps/forum/common/types/forum';
import ForumContext from '@/subapps/forum/common/ui/context';

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

  const isMember = useMemo(() => memberGroups.length !== 0, [memberGroups]);

  const value = useMemo(
    () => ({memberGroups, nonMemberGroups, user, posts, pageInfo, isMember}),
    [memberGroups, nonMemberGroups, user, posts, pageInfo, isMember],
  );

  const handleMenuClick = (link: string) => {
    router.push(`${workspaceURI}/forum/${link}`);
  };

  return (
    <ForumContext value={value}>
      <div className="flex flex-col h-full flex-1">
        <div className="hidden lg:block">
          <NavMenu items={MENU} onClick={handleMenuClick} />
        </div>
        <HomePage />
      </div>
    </ForumContext>
  );
};

export default Content;
