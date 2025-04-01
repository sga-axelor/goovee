'use client';
import {useRouter} from 'next/navigation';
import {useMemo} from 'react';

// ---- CORE IMPORT ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {HomePage, NavMenu} from '@/subapps/forum/common/ui/components';
import {MENU} from '@/subapps/forum/common/constants';
import type {ForumGroup, Group, Post} from '@/subapps/forum/common/types/forum';
import ForumContext from '@/subapps/forum/common/ui/context';

interface groupContentProps {
  memberGroups: Group[];
  nonMemberGroups: Group[];
  user: any;
  posts: Post[];
  selectedGroup: ForumGroup;
  pageInfo: any;
  workspace: PortalWorkspace;
}

const Content = ({
  memberGroups,
  nonMemberGroups,
  user,
  posts,
  selectedGroup,
  pageInfo,
  workspace,
}: groupContentProps) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const value = useMemo(
    () => ({
      memberGroups,
      nonMemberGroups,
      user,
      posts,
      pageInfo,
      selectedGroup,
      workspace,
    }),
    [
      memberGroups,
      nonMemberGroups,
      user,
      posts,
      pageInfo,
      selectedGroup,
      workspace,
    ],
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
