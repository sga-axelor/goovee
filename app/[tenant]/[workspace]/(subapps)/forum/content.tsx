'use client';

import {useRouter} from 'next/navigation';
import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {PortalWorkspace} from '@/types';
import {SUBAPP_CODES} from '@/constants';

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
  workspace,
}: {
  memberGroups: Group[];
  nonMemberGroups: Group[];
  user: any;
  posts: any;
  pageInfo: any;
  workspace: PortalWorkspace;
}) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const isMember = useMemo(() => memberGroups.length !== 0, [memberGroups]);

  const value = useMemo(
    () => ({
      memberGroups,
      nonMemberGroups,
      user,
      posts,
      pageInfo,
      isMember,
      workspace,
    }),
    [memberGroups, nonMemberGroups, user, posts, pageInfo, isMember, workspace],
  );

  const handleMenuClick = (link: string) => {
    router.push(`${workspaceURI}/${SUBAPP_CODES.forum}/${link}`);
  };

  return (
    <ForumContext value={value}>
      <div className="flex flex-col h-full flex-1">
        <div className="hidden lg:block">
          <NavMenu items={MENU} onClick={handleMenuClick} />
        </div>
        <HomePage workspace={workspace} />
      </div>
    </ForumContext>
  );
};

export default Content;
