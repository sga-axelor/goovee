'use client';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORT ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {NavMenu, SingleGroup} from '@/subapps/forum/common/ui/components';
import {MENU} from '@/subapps/forum/common/constants';
import type {ForumGroup, Group, Post} from '@/subapps/forum/common/types/forum';

interface groupContentProps {
  memberGroups: Group[];
  nonMemberGroups: Group[];
  user: any;
  posts: Post[];
  selectedGroup: ForumGroup;
  pageInfo: any;
}

const Content = ({
  memberGroups,
  nonMemberGroups,
  user,
  posts,
  selectedGroup,
  pageInfo,
}: groupContentProps) => {
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
      <SingleGroup
        memberGroups={memberGroups}
        nonMemberGroups={nonMemberGroups}
        user={user}
        posts={posts}
        selectedGroup={selectedGroup}
        pageInfo={pageInfo}
      />
    </div>
  );
};

export default Content;
